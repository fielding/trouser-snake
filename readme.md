# Trouser Snake

### Todo
- [x] Fix interpolation issues when rendering a piece “wraps around” the screen
- [ ] Restrict food spawning under snake segments
- [ ] Restrict food spawning too far off the screen
- [ ] Add a life counter/lives for the player
- [ ] Add a score counter based on the amount of food eaten
- [ ] Implement a gamestate system (most likely just an adaption of what I used in Blox)
- [ ]  Create the following gamestates:
	- [ ] Intro
	- [ ] About
	- [ ] Playing
	- [ ] Paused
	- [ ] Gameover
- [ ] Check for leaks again

### Consider/Review
* Restrict food to only spawning on coordinates that are divisible by 16 (size of the sprites used in game)
* Review interpolation of the segment pieces’ movement. I would like to recreate the 90degree turn look of the original snake games.
* 

