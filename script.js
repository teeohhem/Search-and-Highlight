function searchAndHighlight(searchTerm, selector, highlightClass, removePreviousHighlights) {
    if(searchTerm) {
        //var wholeWordOnly = new RegExp("\\g"+searchTerm+"\\g","ig"); //matches whole word only
        //var anyCharacter = new RegExp("\\g["+searchTerm+"]\\g","ig"); //matches any word with any of search chars characters
        var selector = selector || "body",                             //use body as selector if none provided
            searchTermRegEx = new RegExp("("+searchTerm+")","gi"),
            matches = 0,
            helper = {};
        helper.doHighlight = function(node, searchTerm){
            if(node.nodeType === 3) {
                if(node.nodeValue.match(searchTermRegEx)){
                    matches++;
                    var tempNode = document.createElement('span');
                    tempNode.innerHTML = node.nodeValue.replace(searchTermRegEx, "<span class=""+highlightClass+"">$1</span>");
                    node.parentNode.insertBefore(tempNode, node );
                    node.parentNode.removeChild(node);
                }
            }
            else if(node.nodeType === 1 && node.childNodes && !/(style|script)/i.test(node.tagName)) {
                $.each(node.childNodes, function(i,v){
                    helper.doHighlight(node.childNodes[i], searchTerm);
                });
            }
        };
        if(removePreviousHighlights) {
            $('.'+highlightClass).each(function(i,v){
                var $parent = $(this).parent();
                $(this).contents().unwrap();
                $parent.get(0).normalize();
            });
        }
 
        $.each($(selector).children(), function(index,val){
            helper.doHighlight(this, searchTerm);
        });
        return matches;
    }
    return false;
}
 
$(document).ready(function() {
    $('#search-button').on("click",function() {
        if(!searchAndHighlight($('#search-term').val(), "#bodyContainer", '.highlighted')) {
            alert("No results found");
        }
    });
});
