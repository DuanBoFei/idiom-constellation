## ADDED Requirements

### Requirement: Canvas 2D starry sky background
The game SHALL render a dynamic starry sky background using a dedicated Canvas 2D layer positioned behind all other game elements.

#### Scenario: Canvas initialization
- **WHEN** the game component mounts
- **THEN** a full-screen Canvas element SHALL be created with dimensions matching the viewport, accounting for devicePixelRatio

#### Scenario: Responsive resize
- **WHEN** the viewport resizes
- **THEN** the Canvas SHALL update its dimensions and recalculate particle positions

### Requirement: Particle system
The background SHALL contain a particle system simulating a starry night sky with at least 150 individual star particles.

#### Scenario: Star particle properties
- **WHEN** the particle system is active
- **THEN** each star particle SHALL have: position (x, y), radius (0.5-2.5px), brightness (0.3-1.0), and twinkle phase offset

#### Scenario: Twinkle animation
- **WHEN** the game is in PLAYING state
- **THEN** star particles SHALL twinkle by varying brightness using a sinusoidal function with per-star phase offset

### Requirement: Nebula effect
The background SHALL include 2-3 slowly drifting nebula clouds.

#### Scenario: Nebula rendering
- **WHEN** the particle system is active
- **THEN** 2-3 nebula clouds SHALL be rendered as large, semi-transparent, slowly color-shifting radial gradient blobs

### Requirement: Shooting stars
The background SHALL randomly spawn shooting stars.

#### Scenario: Shooting star lifecycle
- **WHEN** a random interval (3-8 seconds) elapses
- **THEN** a shooting star SHALL animate across the sky from a random start position, with a bright head and fading tail, lasting approximately 1.5 seconds

### Requirement: Performance optimization
The Canvas rendering SHALL maintain 60fps on mid-range devices.

#### Scenario: Particle count limits
- **WHEN** the device has low GPU capability
- **THEN** the particle count SHALL be capped at 150 stars and 2 nebula clouds

#### Scenario: RAF loop management
- **WHEN** the game is not in PLAYING state
- **THEN** the requestAnimationFrame loop SHALL pause to save resources
