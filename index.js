(() => {
    const TYPES = ["character", "location", "episode"];
    const APIS = {
        baseUrl: "https://rickandmortyapi.com/api/",
        character: "character/",
        location: "location/",
        episode: "episode/",
    }
    const CONFIG = {
        character: {
            id: "character-table",
            schema: ["name", "status", "gender", "species", "type", ["origin", "name"], ["location", "name"]],
            headers: ["#", "Name", "Status", "Gender", "Species", "Type", "Origin", "Location"],
            title: "Characters",
            classname: "list-row-character",
            filter: ["name", "status", "species", "type", "gender"]
        },
        location: {
            id: "location-table",
            schema: ["name", "type", "dimension", "residents", "url"],
            headers: ["#", "Name", "Type", "Dimension", "Residents", "Url"],
            title: "Locations",
            classname: "list-row-location",
            filter: ["name", "type", "dimension"]
        },
        episode: {
            id: "episode-table",
            schema: ["name", "air_date", "episode", "url"],
            headers: ["#", "Name", "Air Date", "Episode", "Watch"],
            title: "Episodes",
            classname: "list-row-episode",
            filter: ["name", "episode"]
        }
    }
    // fetch function
    const __fetch__ = (url) => {
        return new Promise(async(resolve, reject) => {
            try {
                fetch(url)
                    .then(res => res.json())
                    .then(resolve)
                    .catch(reject);
            } catch (error) {
                console.log(error)
                reject(error);
            }
        })
    }
    // CLASS RICK AND MORTY API
    class List {
        #list;
        #filter;
        #type;
        #total;
        #pages;
        state;
        #page;
        constructor(type) {
            try {
                if (TYPES.includes(type)) {
                    this.#type = type;
                } else {
                    throw "Invalid type passed";
                }
                this.state = "loading";
                this.#total = 0;
                this.#pages = 0;
                this.#page = 1;
                this.#getList();                
            } catch (error) {
                console.log(error);
            }
        }

        // fetch data
        async #getList() {
            try {
                this.state = "loading";
                let URL = `${APIS.baseUrl}${this.#type}?page=${this.#page}`;
                // for (const key in filter) {

                // }
                const response = await __fetch__(URL);
                this.#total = response.info.count;
                this.#pages = response.info.pages;
                if (response && response.results && response.results.length) {
                    this.#list = response.results;
                    this.#render();
                }
            } catch (error) {
                console.log(error);
            }
        }

        #render() {
            try {
                let listItems = "";
                let counter = 1;
                for (const elem of this.#list) {
                    listItems += `
                    <li class="list-row ${CONFIG[this.#type]["classname"]}">
                        <div class="list-item-cell">${counter++}</div>
                    `
                    for (const key of CONFIG[this.#type]["schema"]) {
                        let path
                        if (typeof key === "string") {
                            path = elem[key]
                        } else {
                            path = key.reduce((acc, curr) => {
                                acc = acc[curr];
                                return acc;
                            }, elem);
                        }
                        listItems += `
                                <div class="list-item-cell">${path}</div>
                                `;
                    };
                    listItems += `
                            </li>
                    
                    `;
                };
                let headerHtml = `
                    <li class="list-row ${CONFIG[this.#type]["classname"]}">
                `
                for (const elem of CONFIG[this.#type]["headers"]) {
                    headerHtml += `
                        <div class="list-item-header list-item-cell">${elem}</div>
                    `   
                }
                headerHtml += `
                    </li>
                `
                const paginationHtml = this.#pagination();
                let listHtml = `
                <h2>${CONFIG[this.#type]["title"]}</h2>
                <ol class="list">
                    ${headerHtml}
                    ${listItems}
                    ${paginationHtml}
                </ol>
        
                `;
                const ELEMENT = document.getElementById(`${CONFIG[this.#type]["id"]}`);
                ELEMENT.innerHTML = listHtml;
                this.#paginationListener();

            } catch (error) {
                console.log(error);
            }
        }

        #pagination() {
            try {
                let paginationHtml = `
                    <li>
                        <div class="pagination">
                            <div class="total">
                                Total: ${this.#total}
                            </div>
                            <div>
                                <ul class="pagination-items" id="pagination-items-${this.#type}" data-type="${this.#type}">
                                    <li class="pagination-item" data-type="${this.#type}" data-action="prev">Prev</li>
                                    <li class="pagination-item">${this.#page}/${this.#pages}</li>
                                    <li class="pagination-item" data-type="${this.#type}" data-action="next">Next</li>
                                </ul>
                            </div>
                        </div>
                    </li>
                `;
                return paginationHtml;
            } catch (error) {
                console.log(error);
            }
        }

        #paginationListener() {
            try {
                const element = document.getElementById(`pagination-items-${this.#type}`);
                element.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (e.target.dataset && e.target.dataset.type && e.target.dataset.action) {
                        switch(e.target.dataset.action) {
                            case "prev":
                                if (this.#page > 1) {
                                    this.#page -= 1;
                                    break;
                                }
                                return;
                            case "next":
                                if(this.#page < this.#pages) {
                                    this.#page += 1;
                                    break;
                                }
                                return;
                            default:
                                return;
                        }
                        this.#getList();   
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const character = new List(TYPES[0]);
    const location = new List(TYPES[1]);
    const episode = new List(TYPES[2]);
})()
// characte filter
/**
 * query
 * name
 * status [dead, alive, unknown]
 * species
 * type
 * gender [female, male, unknown, genderless]
 * 
 */
// location filter
/**
 * name
 * type
 * dimension
 */
// episode filter
/**
 * name
 * episode
 */