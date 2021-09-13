import {SeriesManager} from "./Serie.js";

let JSON_DATA = new SeriesManager();
let tempSeries;
//displaySeries(JSON_DATA);

let hideFS = toggleSwitch("hideFinishedSeries","hide", "false", "true");
let darkMode = toggleSwitch("body", "class", "", "darkMode");
window.onload = () => document.getElementById("darkMode").click(); //Dark Mode by default

document.getElementById("downloadJSON").addEventListener("click", event => downloadJSON());
document.getElementById("loadData").addEventListener("click", event => loadData());
document.getElementById("addCategoryLink").addEventListener("click", event => hide("addCategoryBar","formBar"));
document.getElementById("addCategory").addEventListener("click", event => addCategory());
document.getElementById("addSeries").addEventListener("click", event => addSeries());
document.getElementById("editSeries").addEventListener("click", event => editSeries());
document.getElementById("hideFinishedSeries").addEventListener("click",event => {hideFS.next(); displaySeries(JSON_DATA);});
document.getElementById("editCancel").onclick = () => document.getElementById("myModal").style.display = "none";
document.getElementById("clearData").addEventListener("click",event => {
    JSON_DATA = new SeriesManager();
    displaySeries(JSON_DATA);
    document.getElementById("dataStatus").innerText = "";
});
document.getElementById("darkMode").addEventListener("click",event => darkMode.next());
document.getElementById("searchBar").addEventListener("input", event => search());

// priority color : hover > series finished > color seasons

function search() {
    let search = document.getElementById("searchBar").value;
    if(search === "") {
        displaySeries(JSON_DATA);
    } else {
        let copyData = Object.assign(new SeriesManager(), JSON.parse(JSON.stringify(JSON_DATA)));
        Object.keys(copyData.categories).forEach((name) =>
            copyData.categories[name] = copyData.categories[name].filter(v => v.name.toLowerCase().includes(search.toLowerCase())));
        displaySeries(copyData);
    }
}

function addCategory() {
    let name = document.getElementById("categoryName").value;
    JSON_DATA.add(name);
    document.getElementById("categoryName").value = "";
    document.getElementById("addCategoryBar").setAttribute("class","formBar hide");
    displaySeries(JSON_DATA);
}

function addSeries() {
    JSON_DATA.categories[document.getElementById("addSeriesBar").getAttribute("category")].push({
        "num":parseInt(document.getElementById("seriesNum").value),
        "name":document.getElementById("seriesName").value,
        "seasons_out":document.getElementById("seriesSOut").value,
        "seasons_seen":document.getElementById("seriesSSeen").value,
        "seasons_in_progress":document.getElementById("seriesSInProgress").value,
        "seasons_not_seen":document.getElementById("seriesSNotSeen").value,
        "seasons_coming":document.getElementById("seriesSComing").value,
        "isFinished":document.getElementById("seriesFinished").checked,
        "note":document.getElementById("seriesNote").value,
        "wikiFR":document.getElementById("seriesWikiFR").value,
        "wikiEN":document.getElementById("seriesWikiEN").value
    });
    document.getElementById("seriesNum").value = 0;
    document.getElementById("seriesName").value = "";
    document.getElementById("seriesSOut").value = "";
    document.getElementById("seriesSSeen").value = "";
    document.getElementById("seriesSInProgress").value = "";
    document.getElementById("seriesSNotSeen").value = "";
    document.getElementById("seriesSComing").value = "";
    document.getElementById("seriesFinished").checked = false;
    document.getElementById("seriesNote").value = "";
    document.getElementById("seriesWikiFR").value = "";
    document.getElementById("seriesWikiEN").value = "";
    hide("addSeriesBar", "formBar");
    displaySeries(JSON_DATA);
}

function displaySeries(data) {
    let table = document.getElementById("table");
    Array.from(table.getElementsByTagName("tbody")).forEach(tbody => tbody.remove());
    Object.keys(data.categories).forEach((name) => {
        table.insertAdjacentHTML("beforeend", `\n` +
            `                <tbody>\n` +
            `                    <tr>\n` +
            `                        <th colspan='10'>\n` +
            `                            <div class="tCategoryBar">\n` +
            `                                <div></div>\n` +
            `                                <div>${name}</div>\n` +
            `                                <div class="tCategoryFunctionBar">\n` +
            `                                    <a id="addSeries${name}">[+Series]</a>\n` +
            `                                    <a id="hide${name}">[Hide]</a>\n` +
            `                                </div>` +
            `                            </div>\n` +
            `                        </th>\n` +
            `                    </tr>\n` +
            `                </tbody>`);
        document.getElementById("addSeries"+name).addEventListener("click", event => {
            let a = document.getElementById("addSeriesBar");
            if(!(a.getAttribute("category") !== name && a.getAttribute("class") === "formBar")) hide("addSeriesBar", "formBar");
            a.setAttribute("category",name);
            a.getElementsByTagName("legend")[0].innerText = name;
        });
        document.getElementById("hide"+name).addEventListener("click", event => hide(name));
        let tbody = document.createElement("tbody");
        tbody.setAttribute("id",name);
        let sortedSeries = sortSeriesTable(data.categories[name]);
        sortedSeries.forEach(series => {
            if(!(document.getElementById("hideFinishedSeries").getAttribute("hide") === "true" && series.isFinished)) {
                tbody.insertAdjacentHTML("beforeend", `\n` +
                    `                        <tr ${(series.isFinished) ? "class='sat'" : ""}>\n` +
                    `                            <td>${series.name}</td>\n` +
                    `                            <td>${series.seasons_out}</td>\n` +
                                                    getSeasonsSeen(series) +
                    `                            <td>${series.seasons_coming}</td>\n` +
                    `                            <td>${series.note}</td>\n` +
                                                    getLink(series.wikiFR) +
                                                    getLink(series.wikiEN) +
                    `                            <td class="edit wikiLink"><div><img src="img/edit.png" alt="edit.png"/><img src="img/delete.jpg" alt="delete.jpg" style="width:20px"/></div></td>\n` +
                    `                        </tr>`);
                let edit = tbody.getElementsByClassName("edit");
                edit[edit.length-1].getElementsByTagName("img")[0].addEventListener("click",event => displayEdit(event));
                edit[edit.length-1].getElementsByTagName("img")[1].addEventListener("click",event => displayDelete(series.name, name));
            }
        });
        document.getElementById("table").insertAdjacentElement('beforeend',tbody);
    });
}

function displayEdit(event) {
    let tr = event.target.parentNode.parentNode.parentNode;
    let name = tr.getElementsByTagName("td")[0].innerText;
    let category = tr.parentNode.id;
    document.getElementById("editSeriesBar").setAttribute("category", category);
    document.getElementById("myModal").style.display = "flex";
    tempSeries = JSON_DATA.categories[category].find(e => e.name === name);
    document.getElementById("seriesNumEdit").value = tempSeries.num;
    document.getElementById("seriesNameEdit").value = tempSeries.name;
    document.getElementById("seriesSOutEdit").value = tempSeries.seasons_out;
    document.getElementById("seriesSSeenEdit").value = tempSeries.seasons_seen;
    document.getElementById("seriesSInProgressEdit").value = tempSeries.seasons_in_progress;
    document.getElementById("seriesSNotSeenEdit").value = tempSeries.seasons_not_seen;
    document.getElementById("seriesSComingEdit").value = tempSeries.seasons_coming;
    document.getElementById("seriesFinishedEdit").checked = tempSeries.isFinished;
    document.getElementById("seriesNoteEdit").value = tempSeries.note;
    document.getElementById("seriesWikiFREdit").value = tempSeries.wikiFR;
    document.getElementById("seriesWikiENEdit").value = tempSeries.wikiEN;
}

function editSeries() {
    let category = document.getElementById("editSeriesBar").getAttribute("category");
    JSON_DATA.categories[category].forEach((v, i, t) => {
        if(v.name === tempSeries.name) {
            t[i].num = parseInt(document.getElementById("seriesNumEdit").value);
            t[i].name = document.getElementById("seriesNameEdit").value;
            t[i].seasons_out = document.getElementById("seriesSOutEdit").value;
            t[i].seasons_seen = document.getElementById("seriesSSeenEdit").value;
            t[i].seasons_in_progress = document.getElementById("seriesSInProgressEdit").value;
            t[i].seasons_not_seen = document.getElementById("seriesSNotSeenEdit").value;
            t[i].seasons_coming = document.getElementById("seriesSComingEdit").value;
            t[i].isFinished = document.getElementById("seriesFinishedEdit").checked;
            t[i].note = document.getElementById("seriesNoteEdit").value;
            t[i].wikiFR = document.getElementById("seriesWikiFREdit").value;
            t[i].wikiEN = document.getElementById("seriesWikiENEdit").value;
        }
    });
    document.getElementById("myModal").style.display = "none";
    tempSeries = null;
    displaySeries(JSON_DATA);
}

function displayDelete(name, category) {
    if(confirm("Are you sure want to delete it ?\n"+name+" ("+category+")")) {
        JSON_DATA.categories[category] = JSON_DATA.categories[category].filter(v => v.name !== name);
        displaySeries(JSON_DATA);
    }
}

function loadData() {
    let fileList = document.getElementById("selectDataFile").files;
    if(fileList.length > 0) {
        let file = fileList[0];
        let reader = new FileReader();
        reader.onloadend = data => {
            JSON_DATA = Object.assign(new SeriesManager(), JSON.parse(data.target.result));
            let status = document.getElementById("dataStatus");
            status.innerText = "Data Loaded !";
            status.setAttribute("class","green");
            displaySeries(JSON_DATA);
        };
        reader.readAsText(file);
    }
}

function downloadJSON() {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSON_DATA));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "data.json");
    dlAnchorElem.click();
}

function getSeasonsSeen(series) {
    let seasonsSeen = ``;
    if(series.seasons_seen === "" && series.seasons_in_progress === "" && series.seasons_not_seen === "") {
        seasonsSeen += '                            <td colspan="3" class="empty"></td>\n';
    } else {
        if(series.seasons_seen !== "") {
            if(series.seasons_in_progress === "" && series.seasons_not_seen === "") {
                seasonsSeen += `                            <td colspan="3" class="vu">${series.seasons_seen}</td>\n`;
            } else {
                seasonsSeen += `                            <td colspan="1" class="vu">${series.seasons_seen}</td>\n`;
            }
        }
        if(series.seasons_in_progress !== "") {
            if(series.seasons_seen === "" && series.seasons_not_seen === "") {
                seasonsSeen += `                            <td colspan="3" class="encour">${series.seasons_in_progress}</td>\n`;
            } else if(series.seasons_seen !== "" && series.seasons_not_seen === "") {
                seasonsSeen += `                            <td colspan="2" class="encour">${series.seasons_in_progress}</td>\n`;
            } else {
                seasonsSeen += `                            <td colspan="1" class="encour">${series.seasons_in_progress}</td>\n`;
            }
        }
        if(series.seasons_not_seen !== "") {
            if(series.seasons_seen === "" && series.seasons_in_progress === "") {
                seasonsSeen += `                            <td colspan="3" class="pasvu">${series.seasons_not_seen}</td>\n`;
            } else if(series.seasons_seen === "" || series.seasons_in_progress === "") {
                seasonsSeen += `                            <td colspan="2" class="pasvu">${series.seasons_not_seen}</td>\n`;
            } else {
                seasonsSeen += `                            <td colspan="1" class="pasvu">${series.seasons_not_seen}</td>\n`;
            }
        }
    }
    return seasonsSeen;
}

function hide(id, dClass = "") {
    let toHide = document.getElementById(id);
    if(toHide.getAttribute("class") === null || !toHide.getAttribute("class").includes("hide")) {
        toHide.setAttribute("class", dClass+" hide");
    } else {
        toHide.setAttribute("class", dClass);
    }
}

function * toggleSwitch(id, attribute, initialValue, value) {
    while (true) {
        yield ;
        let toggleSwitch = document.getElementById(id);
        if(toggleSwitch.getAttribute(attribute) === value) {
            toggleSwitch.setAttribute(attribute, initialValue);
        } else {
            toggleSwitch.setAttribute(attribute, value);
        }
        yield ;
    }
}

function sortSeriesTable(table) {
    return table.sort((a, b) => {
        if((a.num !== null && a.num > 0 && a.num !== "") && (b.num !== null && b.num > 0 && b.num !== "")) {
            if(a.num < b.num) return -1;
            else if (a.num > b.num) return 1;
            else return 0;
        } else if((a.num !== null && a.num > 0 && a.num !== "") || (b.num !== null && b.num > 0 && b.num !== "")) {
            if(b.num !== null && b.num > 0 && b.num !== "") return 1;
            else return -1;
        } else if((a.num === null || a.num === undefined || a.num <= 0 || a.num === "") && (b.num === null || b.num === undefined || b.num <= 0 || b.num === "")) {
            if(a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
        } else {
            return 0;
        }
    });
}

function getLink(link) {
    if(link === "") {
        return `                            <td class="wikiLink"></td>\n`;
    } else {
        return `                            <td class="wikiLink"><div><button onclick="window.open('${link}')">+</button></div></td>\n`;
    }
}