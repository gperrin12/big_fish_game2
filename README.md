# Big Fish Hunter

A fishing-themed first-person shooter game inspired by Doom II, where you hunt freshwater sport fish like pike, bass, trout, and walleye using various lures.

## Features

- First-person fishing action
- Multiple fish types with different behaviors and point values
- Various lures with different properties
- 3D environment with water and terrain
- Simple scoring system

## Technical Stack

- Frontend: HTML, CSS, JavaScript, Three.js (WebGL)
- Backend: Python with Flask
- Deployment: Nginx, Gunicorn

## Running Locally

1. Make sure you have Python 3.7+ installed
2. Clone the repository
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the application:
   ```
   python app.py
   ```
5. Access the game at http://localhost:5000

## Deploying to DigitalOcean

1. Create a new Ubuntu droplet on DigitalOcean
2. SSH into your droplet
3. Clone this repository
4. Make the deployment script executable and run it:
   ```
   chmod +x deploy.sh
   ./deploy.sh
   ```
5. Access the game at your droplet's IP address

## Game Controls

- **Move**: WASD keys
- **Aim**: Mouse movement
- **Cast Lure**: Left mouse button
- **Change Lure**: Number keys 1-4

## Adding More Features

Some ideas for expanding the game:
- More fish types with unique behaviors
- Different fishing environments (lakes, rivers, ponds)
- Day/night cycle
- Weather effects
- More detailed fish models
- Sound effects and music
- Multiplayer support