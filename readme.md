# Trouser Snake

### Todo
#### Trouser Snake gameplay related tasks
* Fix interpolation issues when rendering a piece “wraps around” the screen
* Restrict food spawning under snake segments
* Restrict food spawning too far off the screen
* Fix snake growth to mimic traditional snake games (doesn’t just add segments to the end of the tail)
* Add a life counter/lives for the player
* Add a score counter based on the amount of food eaten
* Implement a gamestate system (most likely just an adaption of what I used in Blox)
* Create the following gamestates:
	* Intro
	* About
	* Playing
	* Paused
	* Gameover
* Check for leaks again

#### Framework (new Elle framework) related tasks
* Organize Files/Folders to reflect the XCode project hierarchy
* Implement EntityManager ( as much as I dislike the word manager)
* Figure out a way to allow games to extend the “CoreSystems”
* Implement unique configuration for each game via configuration file
* “EntityFactory” or some way to load entities from a file (data driven)
* 

### Consider/Review
* Restrict food to only spawning on coordinates that are divisible by 16 (size of the sprites used in game)
* Review interpolation of the segment pieces’ movement. I would like to recreate the 90degree turn look of the original snake games.
