from math import pi

import numpy as np

# region
BALL_CIRCUMFERENCE = 29.5 / 36.0  
BALL_RADIUS = BALL_CIRCUMFERENCE / (2 * pi)
min_vel = 0.1
coef_restitution = 0.7
mu_friction = 0.1
eps = 1e-3
ball_mass_kgs = 0.62
ball_area = pi * BALL_RADIUS ** 2
air_temperature_c = 20.0
air_pressure_mb = 1013.25
r_dry = 287.05
p_pa = air_pressure_mb * 100
t_k = air_temperature_c + 273.15
rho_air_kg_m3 = p_pa / (r_dry * t_k)
rho_air_kg_yard3 = rho_air_kg_m3 / (0.9144 ** 3)
quadratic_drag_coeff = 0.47
air_ball_const = 0.5 * rho_air_kg_yard3 * ball_area
magnus_lift_coeff = 0.1
# endregion

GRAVITY_MAG_YARDS_SEC = 10.72

def get_gravity_acc() -> float:
    return np.array([0, 0, -GRAVITY_MAG_YARDS_SEC])

def get_friction_acc(vel):
    v_xy = vel[:2]
    v_norm = np.linalg.norm(v_xy)
    if v_norm == 0:
        return np.array([0, 0, 0])
    a_fric_mag = mu_friction * GRAVITY_MAG_YARDS_SEC
    a_fric_xy = -a_fric_mag * (v_xy / v_norm)
    return np.array([a_fric_xy[0], a_fric_xy[1], 0])

def get_drag_acc(vel):
    # F = 0.5 * rho * v^2 * Cd * A
    # a = F/m
    v_norm = np.linalg.norm(vel)
    if v_norm < eps:
        return np.array([0, 0, 0])
    drag_force_mag = air_ball_const * quadratic_drag_coeff * (v_norm ** 2)
    drag_acc_mag = drag_force_mag / ball_mass_kgs
    drag_acc = -drag_acc_mag * (vel / v_norm)
    return drag_acc  

def get_magnus_acc(vel, omega):
    return magnus_lift_coeff * air_ball_const * np.cross(omega, vel) / ball_mass_kgs

def motion_eq(t, s):
    pos = s[:3]
    vel = s[6:9]
    omega = s[9:]
    if pos[2] <= BALL_RADIUS and vel[2] < eps:
        gravity_acc = np.array([0, 0, 0])
        friction_acc = np.array([0, 0, 0])
        if np.abs(vel[2]) < eps:
            friction_acc = get_friction_acc(vel)
    else:
        gravity_acc = get_gravity_acc()
        friction_acc = np.array([0, 0, 0])
    drag_acc = get_drag_acc(vel)
    magnus_acc = get_magnus_acc(vel, omega)
    acc = gravity_acc + friction_acc + drag_acc + magnus_acc
    ang_acc = np.array([0, 0, 0])
    return np.concatenate((vel, omega, acc, ang_acc))

def compute_trajectory(s, ts):
    pos_t = {}
    current_s = s.copy()
    delta_t = ts[1] - ts[0]
    at_rest = False
    
    for current_t in ts:
        # Store current position
        pos_t[float(current_t)] = current_s[:3].copy()
        
        # Check if ball is at rest
        vel = current_s[6:9]
        vel_magnitude = np.linalg.norm(vel)
        
        if vel_magnitude < min_vel:
            at_rest = True
        
        if at_rest:
            # Ball is at rest, keep position static
            continue
        
        # Compute derivatives using motion equation
        ds = motion_eq(current_t, current_s)
        
        # Euler integration: s_new = s + ds * dt
        new_s = current_s + ds * delta_t
        
        # Check for ground collision
        new_pos = new_s[:3]
        new_vel = new_s[6:9]
        
        if new_pos[2] <= BALL_RADIUS and new_vel[2] < 0:
            # Ball hit the ground while moving down
            # Apply bounce: reverse z-velocity with restitution
            new_vel[2] = -coef_restitution * new_vel[2]
            
            # Adjust z position to be at ground level with restitution
            new_pos[2] = BALL_RADIUS + coef_restitution * (BALL_RADIUS - new_pos[2])
            
            # Check if velocity is now below threshold
            if np.abs(new_vel[2]) < min_vel:
                new_vel[2] = 0.0
                new_pos[2] = BALL_RADIUS
            
            # Update state
            new_s[:3] = new_pos
            new_s[6:9] = new_vel
        
        # Update current state and time
        current_s = new_s
        current_t += delta_t
    
    return pos_t
