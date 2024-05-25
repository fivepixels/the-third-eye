# THE THIRD EYE

<img src="../../../../images/sciencefair/cwsf/left.jpg" />
<img src="../../../../images/sciencefair/cwsf/right.jpg" />

## Question - start

What is the most effective way to increase the accessibility of all websites generally for visually impaired people without having to implement all necessary accessibility functions on their own?

## Inspiration

I read an informative blog post uploaded on HubSpot explaining how to make websites more accessible to everyone, specifically including visually impaired people. After realizing that many people lack the knowledge to make their websites accessible, I thought it would be a good idea to invent something that enhances all websites’ accessibility with a much higher level of user experience for visually impaired users, making it easier for them to navigate and interact with content on websites.

## Procedure for planning

### Background Research

I did background research regarding, first, how serious visual impairment problems become globally, how bad visually impaired people navigate websites, and how many websites do not actually follow the currently existing web content accessibility guidelines.

According to the World Health Organization(WHO), it is estimated that there are at least 2.2 Billion of the global population have problems with their visions. And, the number of internet and social media users is estimated to be 5.35 Billion people, according to Statista. Lastly, the top 95.9% of the websites are not accessible and detected WCAG2 failures, which is the Web Content Accessibility Guidelines from WebAIM.

That means if visually impaired people can use websites like normal users without vision problems, there would be a significant increase in business revenue and profits from them, and a larger population would be able to access and share information.

### Identify Solutions

There could be many solutions to solve the problem of visually impaired people not being able to access web content. So, I decided that whatever I was going to do, the final product should be able to provide full access to the screen that the users are expected to see, communicate with external services to obtain more advanced information and interact with the screen by changing and editing the existing information. Based on these three factors, and since it specifically concerns web content, I decided to go with a Google Chrome Extension. Building a Google Chrome Extension satisfies all three factors and is personally beneficial for me because I have experience in the field of web development.

## Design Process

### 1. Identify Solutions

I identified the problem that this service, “The Third Eye,” was going to solve.

### 2. Detail Solutions

I detailed three types of blindness that this extension should be responsible for: **Partial Blindness, Colour blindness, and Blurriness**.

### 3. Plan Approach

I planned the approach of developing a Google Chrome Extension to achieve the goal.

### 4. Design Approach

I designed what are called Helpers. They are the **Mover** for partial blindness, the **Color Adjuster** for colour blindness, and the **Al Helpers** for blurriness.

### 5. Develop

I developed the extension with the documentation by the Google Chrome Extension team and the planner.

### 6. Get a Code Review

Got a code review from a Google Employee for code review.

## Technologies

### Languages

I used HTML and CSS to build the UI/UX on the option configuring popup window, and I used TypeScript instead of JavaScript, which was required, to get type safety and minify and optimize specifically for Web browsers.

### Packages

Surprisingly, this extension does not use any packages except the packages for contributing to this project. This project gets a portion of information from the external APIs by OpenAI, which causes the problem of not being able to publish to the Chrome Web Store, unfortunately.

### Google Chrome APIs

This extension uses two types of Google Chrome APIs: TTS APIs and Storage APIs. TTS is for actually speaking out the analyzed information to real users who would not be able to detect the information visually. The Storage is for storing and sharing configurations across the devices.

### Extra Tools

## Architecture

See this section on the images above

## Future Considerations

cThe very first future consideration is to **build up an AI that works on users' devices locally** without using the Internet so that the sensitive information this extension grabs can not be shared with external services. The second, which is also connected to the first one, is to publish it, which could not have happened due to its security regarding the AI. Next is to make a trend that developers can easily follow so that the trend of helping visually impaired people can be spread out. And, the last is to allow other developers to write their own helpers, like any other built-in helpers, based on this extension so that the users can choose any provided helpers to enhance their experience on the specific websites.
