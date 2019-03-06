/**
 * Functions used by all pages.
 * 
 * @author George Kaye
 */

var currentTerm;
var freeVariables = new LambdaEnvironment();
var originalTerm;
var reduced = false;

/**
 * Change the text of an element with a given id.
 * @param {string} id   - The id of the element.
 * @param {string} text - the text to change to
 */
function changeText(id, text){
    document.getElementById(id).innerHTML = text;
}

/**
 * Change the value of an element with a given id.
 * @param {string} id   - The id of the element.
 * @param {string} value - the value to change to
 */
function changeValue(id, value){
    document.getElementById(id).value = value;
}

/**
 * Change the value of elements with a given class.
 * @param {string} id   - The class of the elements.
 * @param {string} value - the value to change to
 */
function changeValueClass(className, value){
    var elems = document.getElementsByClassName(className);

    for(var i = 0; i < elems.length; i++){
        elems[i].value = value;
    }
}

/**
 * Set the style of an span with a given class.
 * @param {string} className - The class of the elements.
 * @param {string} style - The style to set.
 */
function setStyleSpan(className, style){
    var elems = document.getElementsByClassName(className);
    
    var re = /class="(.+?)"/g

    for(var i = 0; i < elems.length; i++){
        elems[i].setAttribute("style", style);

        var subs = elems[i].innerHTML;
        var matches = subs.match(re);
        
        for(var j = 0; j < matches.length; j++){
            var elems2 = document.getElementsByClassName(matches[j].substring(7, matches[j].length - 1));

            for(var k = 0; k < elems2.length; k++){
                elems2[k].setAttribute("style", style);
            }
        }
    }
    
}

/**
 * Get the text of an element with a given id.
 * @param {string} id - The id of the element.
 * @return {string} The text of the element.
 */
function getText(id){
    return document.getElementById(id).value;
}

/**
 * Get a 'pretty' string of an array with spaces in between each element.
 * @param {array} array - The array to get the string from.
 */
function prettyString(array){

    if(array.length !== 0){
        var string = array[0];

        if(array.length > 0){
            for(i = 1; i < array.length; i++){
                string += " ";
                string += array[i];
            }
        }
    }

    return string;
}

function printArray(array){
    var string = "";

    for(var i = 0; i < array.length; i++){
        string += array[i] + ", ";
    }

    return string.substring(0, string.length - 2);
}

/**
 * Get the HTML for an element.
 * @param {string} element - The element type.
 * @param {string} className - The class of this element.
 * @param {string} id - The id of this element.
 * @param {string} style - The style of this element.
 * @param {string} onclick - The onclick of this element.
 * @param {string} content - The content of this element.
 * @return {string} The corresponding HTML for this element.
 */
function getElement(element, className, id, style, onclick, content){
    return '<' + element + ' class="' + className + '" id="' + id + '" style="' + style + '" onclick="' + onclick + '">' + content + '</' + element +'>';
}

/**
 * Get the HTML for a <div>.
 * @param {string} className - The class of this <div>.
 * @param {string} id - The id of this <div>.
 * @param {string} style - The style of this <div>.
 * @param {string} onclick - The onclick of this <div>.
 * @param {string} content - The content of this <div>.
 * @return {string} The corresponding HTML for this <div>.
 */
function getDiv(className, id, style, onclick, content){
    return getElement("div", className, id, style, onclick, content);
}

/**
 * Get the HTML for a <p>.
 * @param {string} className - The class of this <p>.
 * @param {string} id - The id of this <p>.
 * @param {string} style - The style of this <p>.
 * @param {string} onclick - The onclick of this <p>.
 * @param {string} content - The content of this <p>.
 * @return {string} The corresponding HTML for this <p>.
 */
function getP(className, id, style, onclick, content){
    return getElement("p", className, id, style, onclick, content);
}

/**
 * Get the HTML for a <hx>.
 * @param {string} className - The class of this <h>.
 * @param {string} id - The id of this <h>.
 * @param {number} num - The heading number of this <h>.
 * @param {string} style - The style of this <h>.
 * @param {string} onclick - The onclick of this <h>.
 * @param {string} content - The content of this <h>.
 * @return {string} The corresponding HTML for this <h>.
 */
function getH(className, id, num, style, onclick, content){
    return getElement("h" + num, className, id, style, onclick, content);
}

/**
 * Get the HTML for a <tr>.
 * @param {string} content - The content of this <tr>.
 * @return {string} The corresponding HTML for this <tr>.
 */
function getRow(content){
    return '<tr>' + content + '</tr>'
}
 
/** Get the HTML for a <td>
 * @param {string} content - The content of this <tr>.
 * @return {string} The corresponding HTML for this <tr>.
 */
function getCell(className, content){
    return '<td class="' + className + '">' + content + "</td>";

}

/**
 * Get the HTML for a bulleted list of elements in an array.
 * @param {Object[]} array - The array.
 * @param {string} id - The id to prefix elements with.
 * @param {string} onmouseover - The script to execute when on mouseover.
 * @return {string} The HTML code for the bulleted list.
 */
function bulletsOfArray(array, id, onclick, onmouseenter, onmouseout){

    var string = "<ul>";

    
    for(var i = 0; i < array.length; i++){



        string += '<li id="' + id + '-' + i + '" onclick="' + onclick.replace("i,", i + ",") + '" onmouseenter="' + onmouseenter.replace("i,", i + ",") + '" onmouseout="' + onmouseout.replace("i,", i + ",") + '">' + array[i] + "</li>";
    }

    string += "</ul>";

    return string;

}

/**
 * Get an HTML representation of a term.
 * @param {Object} term - The lambda term.
 * @return {string} The HTML representation.
 */
function printTermHTML(term){
    return term.printHTML(freeVariables)[0];
}

/**
 * Get the stats for a lambda term in an HTML table format.
 * @param {Object} currentTerm - The lambda term.
 * @param {boolean} labels - If the labels should be displayed on the map.
 * @return {string} The HTML table code for the stats.
 */
function getStats(currentTerm, labels){
    return getRow(getCell("term-heading", '<b>' + printTermHTML(currentTerm) + '</b>')) +
                                                getRow(getCell("term-subheading", '<b>' + currentTerm.prettyPrint() + '</b>')) +
                                                getRow(getCell("term-fact", 'Crossings: ' + currentTerm.crossings())) +
                                                getRow(getCell("term-fact", 'Abstractions: ' + currentTerm.abstractions())) +
                                                getRow(getCell("term-fact", 'Applications: ' + currentTerm.applications())) +
                                                getRow(getCell("term-fact", 'Variables: ' + currentTerm.variables())) +
                                                getRow(getCell("term-fact", 'Free variables: ' + currentTerm.freeVariables())) +
                                                getRow(getCell("term-fact", 'Beta redexes: ' + currentTerm.betaRedexes())) +
                                                getRow(getCell("term-fact", bulletsOfArray(currentTerm.printRedexes(freeVariables), "redex", "clickRedex(i, " + labels + ")", "highlightRedex(i, true)", "unhighlightRedex(i, true)"))) +
                                                getRow(getCell("", '<button type = "button" disabled id = "reset-btn" onclick = "resetButton();">Reset</button><button type = "button" id = "back-btn" onclick = "backButton();">Back</button>')) +
                                                getRow(getCell("", '<button type = "button" id = "norm-btn" onclick = "showNormalisationGraph();">View normalisation graph</button> Draw maps (very costly) <input type = "checkbox" id = "normalisation-maps" checked>'));
}

/**
 * Function to execute when a portrait is clicked.
 * @param {string} exhibit - The id of where the portrait is to be drawn.
 * @param {Object} term - The term to draw.
 * @param {boolean} labels - If the labels should be drawn on the map.
 */
function viewPortrait(exhibit, term, labels){

    currentTerm = term;

    var disabled = '';

    if(!currentTerm.hasBetaRedex()){
        disabled = 'disabled';
    }

    changeText(exhibit, '<table>' +
                                    '<tr>' +
                                        '<td>' + getDiv("w3-container frame big-frame", "frame" + i, "", "", getDiv("w3-container portrait", "portrait" + i, "", "", "")) + '</td>' +
                                        '<td>' +
                                            '<table>' + 
                                                getStats(currentTerm, labels) +   
                                            '</table>' +
                                        '</td>' +
                                    '</tr>' +
                                '</table>'
    )

    drawMap('portrait' + i, currentTerm, freeVariables, true, true, labels);
}

/**
 * Highlight a redex.
 * @param {number} i - The redex to highlight.
 */
function highlightRedex(i){

    var colour = "";

    switch(i % 5){
        case 0:
            colour += "red";
            break;
        case 1:
            colour += "orange";
            break;
        case 2:
            colour += "green";
            break;
        case 3:
            colour += "blue";
            break;
        case 4:
            colour += "violet";
            break;
    }

    setStyleSpan("beta-" + i, "color:" + colour);
    highlightClass("beta-" + i, colour);

}

/**
 * Unhighlight an already highlighted redex.
 * @param {number} i - The redex to unhighlight.
 */
function unhighlightRedex(i){

    setStyleSpan("beta-" + i, "color:black");
    highlightClass("beta-" + i);

}

/**
 * Function to execute when you click a redex.
 * @param {number} i - The redex clicked.
 * @param {boolean} labels - Whether the labels should be displayed on the map.
 */
function clickRedex(i, labels){

    var normalisedTerm = specificReduction(currentTerm, i)[0];
    normalisedTerm.generatePrettyVariableNames(freeVariables);

    if(!reduced){
        reduced = true;
        originalTerm = currentTerm;
    }

    currentTerm = normalisedTerm;
    viewPortrait("church-room", currentTerm, labels);
    document.getElementById("reset-btn").disabled = false;
}

/**
 * Show the normalisation graph for the current term.
 */
function showNormalisationGraph(){

    var reductions = new ReductionGraph(currentTerm);

    changeText('normalisation-studio', getDiv("w3-container frame graph-frame", "normalisation-graph-frame", "", "", getDiv("w3-container portrait", "normalisation-graph", "", "", "")));
    
    changeText('normalisation-studio', '<table>' +
                                    '<tr>' +
                                        '<td>' + getDiv("w3-container frame graph-frame", "normalisation-graph-frame", "", "", getDiv("w3-container portrait", "normalisation-graph", "", "", "")) + '</td>' +
                                        '<td>' +
                                            '<table>' + 
                                                getRow(getCell("term-fact", 'Shortest path: ' + reductions.shortestPathToNormalForm())) +
                                                getRow(getCell("term-fact", 'Longest path: ' + reductions.longestPathToNormalForm())) +
                                                getRow(getCell("term-fact", 'Mean path: ' + reductions.meanPathToNormalForm().toFixed(2))) + 
                                                getRow(getCell("term-fact", 'Median path: ' + reductions.medianPathToNormalForm())) + 
                                                getRow(getCell("term-fact", 'Mode path: ' + reductions.modePathToNormalForm())) + 
                                                getRow(getCell("term-fact", 'Vertices: ' + reductions.vertices())) +
                                                getRow(getCell("term-fact", 'Edges: ' + reductions.edges())) +
                                            '</table>' +
                                        '</td>' +
                                    '</tr>' +
                                '</table>'
    )

    
    drawNormalisationGraph("normalisation-graph", currentTerm, freeVariables, document.getElementById('normalisation-maps').checked);

    document.getElementById("reset-btn").disabled = false;

}