$(function() {
    
    var actions, commandList, userInput, output, command;
    
    actions = {
        'help': function() {
            output.append('<br><span class="light-gray-text">' + 
                          commandList + 
                          '<br></span>');
        },
        'resume': function() {
            $.get('resume.txt', function(data) {
                output.append('<br><span class="light-gray-text">' + 
                          '<span class="pre-wrap">' + data + '</span>' + 
                          '<br></span>');
            });
        }
    };
    
    // Dynamically build the command list once and store it.
    commandList = Object.getOwnPropertyNames(actions);
    commandList.splice(commandList.indexOf('help'), 1);
    commandList = commandList.join('<br>');
    
    userInput = $('#user-input');
    output = $('#output');
    
    $(document).keypress(function(evt) {
        console.log(evt.which);
        if (evt.which === 8) {
            userInput.text(userInput.text().slice(0, -1));
        } else if (evt.which === 13) {
            evt.preventDefault();
            command = userInput.text();
            output.append('> ' + command);
            if (actions.hasOwnProperty(command)) {
                actions[command]();
            } else {
                output.append(': command not found<br>');
            }
            userInput.text('');
        } else {
            userInput.append(String.fromCharCode(evt.which));
        }
    });
    
});