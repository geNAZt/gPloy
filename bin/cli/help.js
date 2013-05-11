module.exports = function() {
    console.log(" Displaying the help");
    console.log("  gploy start                                   - Starts the Deployment Server");
    console.log("  gploy stop                                    - Stops the Deployment Server");
    console.log("  gploy status                                  - Prints the current Status of the Deployment Server");
    console.log("  gploy restart                                 - Restarts the Deployment Server");
    console.log("  gploy add project-name [type] [repo] [branch] - Adds the current dir under name 'project-name' to the Deployment");
    console.log("   type defaults to 'git', repo to 'origin' and branch to 'master'");
}