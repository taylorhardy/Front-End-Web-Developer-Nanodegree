This project was to optimize a pre existing webpage for speed and meeting a for frame rate, the goal being 60fp/s. The project focused on optimizing 
the critical rendering path. Optimization was achieved by the following: 

Compressing images
Minifiying javascript and css pages
Not calling the print styles and using a media attribute instead and placing critical css inline. 

For the frame rate speed increase the following changes were implemented: 

For loops that had unneeded items in them were removed
Animations for the page would only repaint if needed.
Used document.getElementsByClassName rather than querySelectorAll

in order to run the project open the html file you wish to view in a browser. 