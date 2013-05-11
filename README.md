gPloy - Continuous Deployment for developing apps
------

How to install it:

`npm install gPloy -g`

How to use it:
* Start the gPloy Server: gPloy start (it will bind to port 10010)
* Navigate to your project workdir (git repo): gPloy add project-name
* Create a Git Webhook with the url printed
* Done :D

Deployment Flow:
* Git pull
* npm install
* execution of pre.js
* execution of app*.js
* execution of post.js
