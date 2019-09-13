function updateIgnoredDomains(ignoredDomains) {
    chrome.extension.sendRequest({
        greeting: "updateIgnoredDomains",
        ignoredDomains: ignoredDomains
    }, function(response) {});
}


function loadOptions() {
    chrome.storage.sync.get({
            ignoredDomains: [],
        },
        function(items) {

            // First removed all entries from the table, so they can
            // be repopulated.  This will eliminate any inconsistencies we may
            // have by merely updating the view.
            $('#ignoredDomains > tbody > tr > td').parent('tr').empty();
            updateIgnoredDomains(items.ignoredDomains);
            // Add all of the ignored domains to the ignored domains table
            for (var index in items.ignoredDomains) {
                $('#ignoredDomains> tbody:last-child').append(
                    $('<tr/>').append(
                        $('<td/>').text(items.ignoredDomains[index]),
                        $('<td/>').append(
                            $('<button/>', {
                                text: "Remove",
                                class: "btn btn-danger"
                            }).click(removeIgnoredDomain(items.ignoredDomains[index]))
                        )
                    )
                );
            }
        });
}

// This returns a function so that when we add it to the click
// handler with predefined parameters, the inner function is not
// executed.  Otherwise this will cause chaos.
function removeIgnoredDomain(domain) {
    return function(event) {
        chrome.storage.sync.get({
                ignoredDomains: [],
            },
            function(items) {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                } else {
                    var ignoredDomains = items.ignoredDomains;

                    // Dont add duplicate domains.
                    if (ignoredDomains.includes(domain)) {
                        var domain_index = ignoredDomains.indexOf(domain);
                        if (domain_index > -1) {
                            ignoredDomains.splice(domain_index, 1);
                        }
                        chrome.storage.sync.set({
                            ignoredDomains: ignoredDomains
                        }, function() {
                            if (chrome.runtime.lastError) {
                                console.log(chrome.runtime.lastError.message);
                            } else {
                                loadOptions();
                            }
                        });
                    }
                }
            });
    }
}

function addIgnoredDomain() {
    var newDomain = $('#newDomainToIgnore').val();
    chrome.storage.sync.get({
            ignoredDomains: [],
        },
        function(items) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            } else {
                var ignoredDomains = items.ignoredDomains;

                // Dont add duplicate domains.
                if (!ignoredDomains.includes(newDomain)) {
                    ignoredDomains.push(newDomain);
                    chrome.storage.sync.set({
                        ignoredDomains: ignoredDomains
                    }, function() {
                        if (chrome.runtime.lastError) {
                            console.log(chrome.runtime.lastError.message);
                        } else {
                            loadOptions();
                            $('#newDomainToIgnore').val('');
                            $('#ignoredDomainErrors').hide();
                        }
                    });
                } else {
                    $('#ignoredDomainErrors').text('Already ignored domain: ' + newDomain);
                    $('#ignoredDomainErrors').show();
                }
            }
        });
}

function callback() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    }
}

$(document).ready(function() {
    loadOptions();
    $('#ignoredDomainErrors').hide();
    $('#addIgnoredDomain').click(addIgnoredDomain);
});
