


class GSprite{
    /**
     * @type {string}
     */
    #id;

    /**
     * @param {string} id 
     */
    constructor(id){
        this.#id = id;
    }

    get id(){
        return this.#id;
    }
}