# Race of Nations - Project Details

## What is the project?
"Race of Nations" is a live, interactive, country-based virtual racing game designed specifically for livestreams. It operates as a web application that can be overlaid onto video streams using broadcasting software like OBS Studio as a Browser Source. In this game, viewers collectively represent their countries and influence a live car race in real-time directly through the stream's chat box.

## The Idea
The core idea is to gamify the livestream viewing experience by turning passive viewers into active participants. Instead of just watching a streamer play a game, the stream's chat *is* the controller. Viewers represent their chosen nations and must work together with fellow compatriots in the chat to propel their country's car to the finish line before the other nations. It taps into national pride and competitive spirit to drive massive chat engagement.

## How it Should Work
1. **Lobby Phase**: The streamer opens the lobby screen, and a countdown timer begins (e.g., 60 seconds). During this pre-race period, viewers can type their country's code in the chat to vote for their nation to be included in the upcoming race.
2. **Racing Phase**: Up to 8 selected countries line up on an 8-lane track. The cars move from left to right at a base speed. As viewers type their country codes in the stream's live chat, the backend processes these messages in real-time and applies a speed boost to that country's car. The boost scales logarithmically to prevent spam from completely breaking the game, but generally, the more viewers actively typing for a country, the faster its car goes.
3. **Obstacles**: To keep the race dynamic and unpredictable, random obstacles (like oil slicks, rocks, or bananas) appear on the track. Cars colliding with these obstacles suffer a temporary speed penalty.
4. **Results & Leaderboard**: The first car to cross the finish line wins the race. A cinematic results screen announces the winner and updates a persistent session leaderboard, tracking the total historical wins for each country to build a long-term narrative throughout the stream.

## Goal and Need for the Project
**The Need:** Livestreamers are constantly searching for innovative ways to engage their audience and increase chat velocity. High chat interaction is a crucial metric favored by streaming platform algorithms (like YouTube and Twitch), leading to better discoverability, higher viewer retention, and channel growth. 
**The Goal:** To provide content creators with a completely free, easy-to-setup, and highly entertaining tool that naturally encourages massive chat participation. By leveraging friendly country-based rivalry, viewers are highly motivated to spam the chat to help their team win.

## The End Goal We Want to Achieve
The ultimate end goal for the MVP (Minimum Viable Product) is to build a robust, smooth (60 FPS) interactive experience capable of parsing real-time chat data with minimal latency (under a 2-second delay from chat message to on-screen boost). 

It must:
- Handle 10-50 concurrent active viewers reliably.
- Run entirely locally on the streamer's machine with zero hosting or API costs.
- Provide a comprehensive admin panel allowing the streamer to tweak settings (speed, timers, volume) and control the flow of the broadcast seamlessly.
- Serve as a highly polished, visually appealing "Streamer Widget" that looks professional on stream.
