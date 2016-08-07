# Blinkbot

## Getting Started

1. Download the zip package for your OS at: https://github.com/Buffbot/blinkbot/tree/master/electron-builds

2. Run Blinkbot.exe

3. Follow the login instructions. Here is detailed info...

* User: The user is whatever user the bot will act as. This can be your own user that you stream with or a bot user that you set up. This affects the OAUTH though...
* OAUTH: OAUTH is a token you can get to authenticate yourself with twitch and have the bot send messages to your channel. When logging into twitch apps, use the above user. Copy the entire token.
* Channel: The channel to watch over and send messages to, must be formatted like: `#channelname`

4. I use OBS, therefore my instructions are for OBS only.

* Add it as a window capture source
* Add a filter for cropping if the top file menu is visible
* Add a color key filter for the custom color #000000 (black)

5. Have fun!

## Commands

#### Public Commands

`!play yyz`: Adds a request to the list
`!playinstead`: Alter your current request
`!cancel`: Cancels your request
`!myrequest`: Get the status of your current request
`!list`: Shows the list of songs
`!list 2 5`: List accepts a range so that you can get a list of requests between a certain queue position.


#### Moderator Commands

* Available to ALL moderators on the channel

`!inject yyz`: Adds a request immediately after the current song.
`!next`: Move to next request
`!pause`: Finishes the current requests without activating the next request
`!stoprequests`: Prevents requests from being added.
`!startrequests`: Enables requests to be added. (Enabled by default)
`!clear`: Clears all requests from the list
