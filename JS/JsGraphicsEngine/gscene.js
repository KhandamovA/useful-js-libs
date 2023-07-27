

class GScene {
    /** Приватные методы */

    #html_view = document.createElement('div');
    /**
     * @type {number}
     */
    #width;
    #setWidth = (w, post)=>{
        this.#html_view.style.width = w + post;
        this.#width = w;
    }

    /**
     * @type {number}
     */
    #height;
    #setHeight = (h, post)=>{
        this.#html_view.style.height = h + post;
        this.#height = h;
    }

    /**
     * @type {Map<string, GSprite>}
     */
    #sprites = new Map;

    constructor(){
        this.#setHeight(10, "px");
        this.#setWidth(10, "px");
        this.#html_view.classList.add('ss');
    }

    /** Публичные методы */

    /**
     * Изменение размеров сцены в пикселях
     * @param {number} w 
     * @param {number} h 
     */
    resizePX(w, h){
        this.#setWidth(w, "px");
        this.#setHeight(h, "px");
    }

    /**
     * Список классов элемента
     * @type {DOMTokenList}
     */
    get classList(){
        return this.#html_view.classList;
    }

    get size(){
        return {
            width : this.#width,
            height : this.#height
        }
    }

    get sprites(){
        return this.#sprites;
    }

    /**
     * Добавление спрайта на сцену
     * @param {GSprite} sprite 
     */
    appendSprite(sprite){
        this.#sprites.set(sprite.id, sprite);
    }
}