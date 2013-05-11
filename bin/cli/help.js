module.exports = function() {
    console.log(" Displaying the help");
    console.log("  gPloy start                                   - Starts the Deployment Server");
    console.log("  gPloy stop                                    - Stops the Deployment Server");
    console.log("  gPloy status                                  - Prints the current Status of the Deployment Server");
    console.log("  gPloy restart                                 - Restarts the Deployment Server");
    console.log("  gPloy add project-name [type] [repo] [branch] - Adds the current dir under name 'project-name' to the Deployment");
    console.log("   type defaults to 'git', repo to 'origin' and branch to 'master'");
}