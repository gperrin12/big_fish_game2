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
5. Access the game at http://127.0.0.1:8080

## Deploying to DigitalOcean

1. Create a new Ubuntu droplet on DigitalOcean
2. SSH into your droplet
3. Clone this repository:
   ```
   git clone https://github.com/YOUR_USERNAME/big_fish_game2.git
   cd big_fish_game2
   ```
4. Make the deployment script executable and run it:
   ```
   chmod +x deploy.sh
   ./deploy.sh
   ```
5. Access the game at your droplet's IP address

## Troubleshooting

If you see a "Loading..." screen that never completes:

1. Check the browser console for JavaScript errors (F12 or right-click → Inspect)
2. Make sure the Three.js libraries are loading properly
3. Try a different browser (Chrome or Firefox recommended)
4. Check server logs:
   ```
   sudo journalctl -u big_fish_game
   ```

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