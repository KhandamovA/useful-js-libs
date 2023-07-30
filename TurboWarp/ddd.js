(function (Scratch) {
  'use strict';
  /*
   * JsAddon extension v1.0 by KhandamovA
   */

  let functions = new Map;

  let jsons_values = new Map;

  /**
   * @type {HTMLElement}
   */
  let focusElement;

  let labelblock = (text) => ({
    blockType: Scratch.BlockType.LABEL,
    text: text
  });

  let buttonblock = (text, method_name) => ({
    opcode: method_name,
    blockType: Scratch.BlockType.BUTTON,
    text: text
  });

  const my_id = 'KhandamovA';

  class JSAddon {
    getInfo() {
      this.init();
      return {
        id: 'KhandamovA',
        name: 'JsAddon',
        color1: '#4d0092',
        blocks: [
          labelblock('JS'),
          {
            opcode: 'js_exec_code',
            blockType: Scratch.BlockType.COMMAND,
            text: 'return result to [variable] from js code [js]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                menu: 'get_vars'
              },
              js: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'let g = new GVar(\'my variable\'); let l = new LVar(\'my variable\'); return \'hello JavaScript! \' + g + \' \' + l;'
              },
            }
          },
          {
            opcode: 'js_exec_code_ret',
            blockType: Scratch.BlockType.REPORTER,
            text: 'return result from js code [js]',
            arguments: {
              js: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'let g = new GVar(\'my variable\'); let l = new LVar(\'my variable\'); return \'hello JavaScript! \' + g + \' \' + l;'
              },
            }
          },
          {
            opcode: 'js_init_func',
            blockType: Scratch.BlockType.COMMAND,
            text: 'register function by name [name] from js code [js] reinit [quest]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'TestFunction'
              },
              js: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'let g = new GVar(\'my variable\'); let l = new LVar(\'my variable\'); return \'hello JavaScript! \' + g + \' \' + l;'
              },
              quest: {
                type: Scratch.ArgumentType.STRING,
                menu: 'get_vals'
              },
            }
          },
          {
            opcode: 'js_remove_func',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete function by name [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                menu : 'get_funcs'
              }
            }
          },
          {
            opcode: 'js_func_is_init',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'function by name [name] is registered?',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'TestFunction'
              }
            }
          },
          {
            opcode: 'js_exec_code_from_func',
            blockType: Scratch.BlockType.COMMAND,
            text: 'return result to [variable] from js function by name [func]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                menu: 'get_vars'
              },
              func: {
                type: Scratch.ArgumentType.STRING,
                menu : 'get_funcs'
              },
            }
          },
          {
            opcode: 'js_exec_code_from_func_ret',
            blockType: Scratch.BlockType.REPORTER,
            text: 'return result from js function by name [func]',
            arguments: {
              func: {
                type: Scratch.ArgumentType.STRING,
                menu : 'get_funcs'
              },
            }
          },
          {
            opcode: 'js_ret_convert_var',
            blockType: Scratch.BlockType.REPORTER,
            text: 'return [variable] as js variable',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                menu: 'get_vars'
              }
            }
          },
          {
            opcode: 'js_ret_all_functions',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all functions'
          },
          labelblock('JSON'),
          {
            opcode: 'js_json_create',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create json var [name] with value [value]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myJson'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{ "age" : 27, "name" : "Json", "items" : ["mask", "water", "axe"] }'
              }
            }
          },
          {
            opcode: 'js_json_delete',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete json var [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                menu: 'get_jsons'
              }
            }
          },
          {
            opcode: 'js_json_exist',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'json var [name] exist?',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myJson'
              }
            }
          },
          {
            opcode: 'js_json_get_var',
            blockType: Scratch.BlockType.REPORTER,
            text: 'json var [variable]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                menu: 'get_jsons'
              }
            }
          },
          {
            opcode: 'js_json_as_object',
            blockType: Scratch.BlockType.REPORTER,
            text: '[variable] as object param [param]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              param: {
                type: Scratch.ArgumentType.STRING,
                menu: 'get_constr_json'
              }
            }
          },
          {
            opcode: 'js_json_as_value',
            blockType: Scratch.BlockType.REPORTER,
            text: '[variable] as value',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              }
            }
          },
          {
            opcode: 'js_json_set_new_key',
            blockType: Scratch.BlockType.COMMAND,
            text: 'key [variable] set param [key] with value [value]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'new_key'
              }
            }
          },
          {
            opcode: 'js_json_remove_key',
            blockType: Scratch.BlockType.COMMAND,
            text: 'key [variable] remove param [key]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'new_key'
              }
            }
          },
          {
            opcode: 'js_json_set_value',
            blockType: Scratch.BlockType.COMMAND,
            text: 'key [variable] set value [value]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              }
            }
          },
          {
            opcode: 'js_json_change_value',
            blockType: Scratch.BlockType.COMMAND,
            text: 'key [variable] change value [value]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              }
            }
          },
          {
            opcode: 'js_json_add_item_to_array',
            blockType: Scratch.BlockType.COMMAND,
            text: 'key [variable] add item [item] to array',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'new item'
              }
            }
          },
          {
            opcode: 'js_json_remove_item_index',
            blockType: Scratch.BlockType.COMMAND,
            text: 'key [variable] remove item #[item] in array',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              item: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'js_json_remove_item_name',
            blockType: Scratch.BlockType.COMMAND,
            text: 'key [variable] remove items with name [item] in array',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              }
            }
          },
          {
            opcode: 'js_json_remove_all_vars',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete all json vars from dataStorage',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              }
            }
          },
          {
            opcode: 'js_json_save_all_vars',
            blockType: Scratch.BlockType.COMMAND,
            text: 'save in dataStorage all json vars',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              }
            }
          },
        ],
        menus: {
          get_vars: {
            acceptReporters: true,
            items: 'getVars'
          },
          get_lists: {
            acceptReporters: true,
            items: 'getLists'
          },
          get_jsons: {
            acceptReporters: true,
            items: 'getJSONS'
          },
          get_funcs :{
            acceptReporters: true,
            items : 'getFuncs'
          },
          get_vals: {
            acceptReporters: true,
            items: [
              {
                text: 'no',
                value: 'no'
              },
              {
                text: 'yes',
                value: 'yes'
              },
            ]
          },

          get_constr_json: {
            acceptReporters: true,
            items: 'getJSONByConstruct'
          }
        }
      };
    }

    get dataStorage(){
      return vm.runtime.getTargetForStage().lookupOrCreateList('KhandamovADataStorage', 'JsAddon:Storage').value;
    }

    js_json_remove_all_vars(){
      this.deleteAllJsons();
    }

    js_json_save_all_vars(){
      this.saveJsons();
    }

    js_json_remove_key({variable, key}){
      let keys = variable.split('|');
      if(keys.length >= 1 && jsons_values.has(keys[0])){
        let json = jsons_values.get(keys[0]);
        for(let i = 1; i < keys.length - 1; i++){
          if(typeof json[keys[i]] !== 'undefined'){
            json = json[keys[i]];
          }else{
            return "";
          }
        }

        let k = Object.keys(json);
        if(keys.length > 1 && k.includes(keys[keys.length - 1])){
          delete json[keys[keys.length - 1]][key];
        }else if (keys.length == 1){
          if(typeof json === 'object'){
            delete json[key];
          }
        }
      }else{
        return "";
      }
    }

    js_json_remove_item_index({variable, item}){
      let keys = variable.split('|');
      if(keys.length >= 1 && jsons_values.has(keys[0])){
        let json = jsons_values.get(keys[0]);
        for(let i = 1; i < keys.length - 1; i++){
          if(typeof json[keys[i]] !== 'undefined'){
            json = json[keys[i]];
          }else{
            return "";
          }
        }

        let k = Object.keys(json);
        if(keys.length > 1 && k.includes(keys[keys.length - 1])){
          json[keys[keys.length - 1]].splice(item, 1);
        }else if (keys.length == 1){
          if(typeof json === 'object'){
            json.splice(item, 1);
          }
        }
      }else{
        return "";
      }
    }

    js_json_remove_item_name({variable, item}){
      let keys = variable.split('|');
      if(keys.length >= 1 && jsons_values.has(keys[0])){
        let json = jsons_values.get(keys[0]);
        for(let i = 1; i < keys.length - 1; i++){
          if(typeof json[keys[i]] !== 'undefined'){
            json = json[keys[i]];
          }else{
            return "";
          }
        }

        let k = Object.keys(json);
        if(keys.length > 1 && k.includes(keys[keys.length - 1])){
          json[keys[keys.length - 1]] = json[keys[keys.length - 1]].filter(x => x != item);
        }else if (keys.length == 1){
          if(typeof json === 'object'){
            json = json.filter(x => x != item);
          }
        }
      }else{
        return "";
      }
    }

    js_json_set_new_key({variable, value, key}){
      let keys = variable.split('|');
      if(keys.length >= 1 && jsons_values.has(keys[0])){
        let json = jsons_values.get(keys[0]);
        for(let i = 1; i < keys.length - 1; i++){
          if(typeof json[keys[i]] !== 'undefined'){
            json = json[keys[i]];
          }else{
            return "";
          }
        }

        let k = Object.keys(json);
        if(keys.length > 1 &&  k.includes(keys[keys.length - 1])){
          if(typeof json[keys[keys.length - 1]] === 'object'){
            json[keys[keys.length - 1]][key] = value;
          }else{
            json[keys[keys.length - 1]] = {};
            json[keys[keys.length - 1]][key] = value;
          }
        }else if (keys.length == 1){
          json[key] = value;
        }
      }else{
        return "";
      }
    }

    js_json_as_object(args) {
      return args.variable + '|' + args.param;
    }

    js_json_as_value({variable}){
      let keys = variable.split('|');
      if(keys.length >= 1 && jsons_values.has(keys[0])){
        let json = jsons_values.get(keys[0]);
        for(let i = 1; i < keys.length; i++){
          if(typeof json[keys[i]] !== 'undefined'){
            json = json[keys[i]];
          }else{
            return "undefined";
          }
        }

        if(typeof json === 'string'){
          return json;
        }else{
          return JSON.stringify(json);;
        }
      }else{
        return "";
      }
    }

    js_json_set_value({variable, value}){
      let keys = variable.split('|');
      if(keys.length >= 1 && jsons_values.has(keys[0])){
        let json = jsons_values.get(keys[0]);
        for(let i = 1; i < keys.length - 1; i++){
          if(typeof json[keys[i]] !== 'undefined'){
            json = json[keys[i]];
          }else{
            return "";
          }
        }

        let k = Object.keys(json);
        if(keys.length > 1 &&  k.includes(keys[keys.length - 1])){
          json[keys[keys.length - 1]] = value;
        }else if (keys.length == 1){
          json = value;
        }
      }else{
        return "";
      }
    }

    js_json_change_value({variable, value}){
      let keys = variable.split('|');
      if(keys.length >= 1 && jsons_values.has(keys[0])){
        let json = jsons_values.get(keys[0]);
        for(let i = 1; i < keys.length - 1; i++){
          if(typeof json[keys[i]] !== 'undefined'){
            json = json[keys[i]];
          }else{
            return "";
          }
        }

        let k = Object.keys(json);
        if(k.includes(keys[keys.length - 1])){
          if(keys.length > 1 &&  typeof json[keys[keys.length - 1]] === 'number' || isNaN(json[keys[keys.length - 1]])){
            json[keys[keys.length - 1]] += value;
          }
        }else if (keys.length == 1){
          if(typeof json === 'number' || isNaN(json)){
            json += value;
          }
        }
      }else{
        return "";
      }
    }

    js_json_add_item_to_array({variable, item}){
      let keys = variable.split('|');
      if(keys.length >= 1 && jsons_values.has(keys[0])){
        let json = jsons_values.get(keys[0]);
        for(let i = 1; i < keys.length - 1; i++){
          if(typeof json[keys[i]] !== 'undefined'){
            json = json[keys[i]];
          }else{
            return "";
          }
        }

        let k = Object.keys(json);
        if(keys.length > 1 &&  k.includes(keys[keys.length - 1])){
          if(typeof json[keys[keys.length - 1]] === 'object'){
            json[keys[keys.length - 1]].push(item);
          }
        }else if (keys.length == 1){
          if(typeof json === 'object'){
            json.push(item);
          }
        }
      }else{
        return "";
      }
    }

    isFloat(n) {
      let res1 = Number.isInteger(n);
      let res2 = Number(n) === n && n % 1 !== 0;
      return res1 || res2;
    }

    replaceSubstringByIndex(inputString, startIndex, endIndex, replacement) {
      if (startIndex < 0 || endIndex >= inputString.length || startIndex > endIndex) {
        return "";
      }

      const firstPart = inputString.slice(0, startIndex);
      const secondPart = inputString.slice(endIndex + 1);
      return firstPart + replacement + secondPart;
    }

    /**
     * Возвращает айди блока под фокусом
     * @returns id блока
     */
    getFocusBlock() {
      for (let i = 0; i < 6; i++) {
        if (focusElement == null) {
          return null;
        }
        if (typeof focusElement.classList !== 'undefined') {
          if (!focusElement.classList.contains('blocklyDraggable')) {
            focusElement = focusElement.parentElement;
          } else {
            return focusElement;
          }
        } else {
          return null;
        }
      }
    }

    getIdFocusBlock() {
      let r = this.getFocusBlock();
      return r == null ? null : r.getAttribute('data-id');
    }

    getFocusDropText() {
      let f = focusElement.querySelectorAll('.blocklyDropdownText')
      if (f.length > 0) {
        return f[0];
      } else {
        return null;
      }
    }

    /**
     * Входная точка где создаются нужные инструменты и ресурсы
     */
    init() {
      /**
       * Событие для отслеживания элементов
       */
      document.addEventListener('mousemove', (event) => {
        focusElement = event.target;
      })

      vm.extensionManager.emitTargetsUpdate;

      /**
       * Восстановление сохраненых Json-ов
       */
      try {
        for (let i = 0; i < this.dataStorage.length; i++) {
          const v = this.dataStorage[i];
          if (v == '$restore_json') {
            let name = this.dataStorage[i + 1];
            let json = this.dataStorage[i + 2];
            i += 2;
            jsons_values.set(name, JSON.parse(json));
          }

        }
      } catch {

      }
    }

    SaveFunctions(){
      ///TODO fix save functions
      let e = 0;
      while (true) {
        let index = this.dataStorage.indexOf('$restore_function', e);
        e = index;
        if (index == -1) {
          break;
        } else {
          this.dataStorage.splice(index, 7);
        }
      }
      /**
       * success: false,
              exec: () => { return 'error'; },
              isReturned: js.includes('return'),
              cArguments: vars_.length,
              variables: vars_
       */

      functions.forEach((v, k) => {
        this.dataStorage.push('$restore_function');
        this.dataStorage.push(k);
        this.dataStorage.push(v.success);
        this.dataStorage.push(v.exec.toString());
        this.dataStorage.push(v.isReturned);
        this.dataStorage.push(v.cArguments);
        this.dataStorage.push(JSON.parse(v.vars_));
      });
    }

    deleteAllJsons() {
      let e = 0;
      while (true) {
        let index = this.dataStorage.indexOf('$restore_json', e);
        e = index;
        if (index == -1) {
          break;
        } else {
          this.dataStorage.splice(index, 3);
        }
      }
    }

    deleteOneJsons(key) {
      let e = 0;
      while (true) {
        let index = this.dataStorage.indexOf('$restore_json', e);
        e = index + 1;
        if (index == -1) {
          break;
        } else {
          if (this.dataStorage[index + 1] == key) {
            this.dataStorage.splice(index, 3);
            break;
          }
        }
      }
    }

    saveJsons() {
      this.deleteAllJsons();

      jsons_values.forEach((v, k) => {
        this.dataStorage.push('$restore_json');
        this.dataStorage.push(k);
        this.dataStorage.push(JSON.stringify(v));
      });
    }

    getBlocksOpcode(container, opcode) {
      opcode = my_id + "_" + opcode;
      const fblocks = Object.values(container).filter(x => x.opcode == opcode);

      /**
       * @type {Array<{opcode : text, inputs : Array<{name : text, id : text}, fields : Array<{name : text, value : text}}>}
       */
      let ret = new Array;
      for (let i = 0; i < fblocks.length; i++) {

        /**
         * @type {Array<{name : text, id : text}>}
         */
        let input_ = new Array;
        const inputs_ = Object.values(fblocks[i].inputs);
        inputs_.forEach(v => {
          input_.push({
            name: v.name,
            id: v.block
          });
        });

        /**
          * @type {Array<{name : text, value : text}>}
          */
        let field_ = new Array;
        const fields_ = Object.values(fblocks[i].fields);
        fields_.forEach(v => {
          field_.push({
            name: v.name,
            value: v.value
          });
        });

        ret.push({
          id: fblocks[i].id,
          opcode: fblocks[i].opcode,
          inputs: input_,
          fields: field_
        });
      }

      return ret;
    }

    getBlockId(container_, id_) {
      const fblocks = Object.values(container_).filter(x => x.id == id_);

      if (id_ == undefined || id_ == null) {
        return {
          success: false
        }
      }
      /**
       * @type {{opcode : text, inputs : Array<{name : text, id : text}>, fields : Array<{name : text, value : text}}}
       */
      let ret;
      if (fblocks.length > 0) {
        /**
          * @type {Array<{name : text, id : text}>}
          */
        let input_ = new Array;
        const inputs_ = Object.values(fblocks[0].inputs);
        inputs_.forEach(v => {
          input_.push({
            name: v.name,
            id: v.block
          });
        });

        /**
          * @type {Array<{name : text, value : text}>}
          */
        let field_ = new Array;
        const fields_ = Object.values(fblocks[0].fields);
        fields_.forEach(v => {
          field_.push({
            name: v.name,
            value: v.value
          });
        });

        ret = {
          success: true,
          opcode: fblocks[0].opcode,
          inputs: input_,
          fields: field_,
          id: id_
        };
        return ret;
      } else {
        ret = {
          success: false
        }
        return ret;
      }
    }

    getTarget(targetid) {
      let mytarget = null;
      const result = Object.values(vm.runtime.targets).filter(x => x.id == targetid);
      if (result.length > 0) {
        mytarget = result[0];
      }

      return mytarget;
    }

    getVars(targetid) {
      const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.type != 'list');
      const localVars = Object.values(vm.editingTarget.variables).filter(x => x.type != 'list');
      const uniqueVars = [...new Set([...globalVars, ...localVars])];
      if (uniqueVars.length === 0) {
        return [
          {
            text: 'select a variable',
            value: 'select a variable'
          }
        ];
      }

      return uniqueVars.map(i => ({
        text: i.name,
        value: i.id
      }));
    }

    getLists() {
      document.elementFromPoint()

      const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.type == 'list');
      const localVars = Object.values(vm.editingTarget.variables).filter(x => x.type == 'list');
      const uniqueVars = [...new Set([...globalVars, ...localVars])];
      if (uniqueVars.length === 0) {
        return [
          {
            text: 'select a list',
            value: 'select a list'
          }
        ];
      }

      return uniqueVars.map(i => ({
        text: i.name,
        value: i.id
      }));
    }

    getJSONS() {
      let res = [];
      jsons_values.forEach((v, k) => {
        res.push({
          text: k,
          value: k
        })
      });

      if (res.length == 0) {
        return [{
          text: 'select a variable',
          value: 'select a variable'
        }]
      } else {
        return res;
      }
    }

    getBlockParams(res, blks, id) {
      let block = this.getBlockId(blks, id);
      if (block.success == false) {
        return;
      } else {
        if (block.fields.length > 0) {
          for (let i = 0; i < block.fields.length; i++) {
            let f = block.fields[block.fields.length - 1 - i];
            res.array.push(f.value);
          }
          return;
        } else if (block.inputs.length > 0) {
          for (let i = 0; i < block.inputs.length; i++) {
            let f = block.inputs[block.inputs.length - 1 - i];
            this.getBlockParams(res, blks, f.id);
          }
        } else {
          return;
        }
      }
    }

    getJSONByConstruct(targetid) {
      let id = this.getIdFocusBlock();
      let blocks = this.getTarget(targetid).blocks._blocks;
      if (id != null) {
        let block = this.getBlockId(blocks, id);

        let results = { array: [] };
        // this.helper(results, blocks, id);

        let variable;
        let key;
        if (block.success == true) {
          this.getBlockParams(results, blocks, id);
        }

        let json_var = null;
        let answer = [];

        if (results.array.length >= 2 && jsons_values.has(results.array[results.array.length - 1])) {
          json_var = jsons_values.get(results.array[results.array.length - 1]);
        }

        if (json_var != null) {
          for (let i = 1; i < results.array.length - 1; i++) {
            let value = results.array[results.array.length - 1 - i];
            if (typeof json_var[value] !== undefined) {
              json_var = json_var[value];
            } else {
              answer = [{
                text: 'failed',
                value: 'failed'
              }];
              return answer;
              break;
            }
          }

          if (typeof json_var === 'number') {
            answer = [{
              text: 'select a param',
              value: 'select a param'
            }];
          } else {
            let keys = Object.keys(json_var);
            for (let i = 0; i < keys.length; i++) {
              answer.push({
                text: keys[i],
                value: keys[i]
              });
            }

            if (keys.length == 0) {
              answer.push({
                text: 'object haven\'t params',
                value: 'object haven\'t params'
              });
            }

            return answer;
          }
        }

        console.log('getJSONByConstruct', id, results, vm);

      }
      return [
        {
          text: 'select a param',
          value: 'select a param'
        }
      ];
    }

    getFuncs(){
      let res = [];
      functions.forEach((v, k) => {
        res.push({
          text: k,
          value: k
        })
      });

      if (res.length == 0) {
        return [{
          text: 'select a function',
          value: 'select a function'
        }]
      } else {
        return res;
      }
    }

    js_exec_code(args) {
      console.log(args.js);
      try {
        console.log(args);
        let js = args.js + '';
        let n = 0; let e = 0;
        let className = '';
        let argument = '';
        let cond = -1;
        let scodeEnd = -1;
        while (true) {
          //let g = new GVar(\'my variable\'); let l = new LVar(\'my variable\'); return \'hello JavaScript! \' + g + \' \' + l;
          n = js.indexOf('new', e);
          e = n;
          console.log('new find', n);
          if (n != -1) {
            let cls1 = js.indexOf('(');
            let cls2 = js.indexOf(';');
            let cls3 = js.indexOf(' ');
            let cls4 = js.length;

            if (cls1 != -1) {
              className = js.substring(n + 4, cls1);
              className = className.replace(' ', '');
              scodeEnd = js.indexOf(')', cls1);
              cond = cls1;
              if (scodeEnd == -1) {
                break;
              }
            } else if (cls2 != -1) {
              e = cls2;
              continue;
            } else if (cls3 != -1) {
              e = cls3;
              continue;
            } else {
              break;
            }
          } else {
            break;
          }

          console.log('classname', className, 'new var', Scratch);

          if (cond != -1) {
            let begA = js.indexOf('\'', cond);
            let endA = js.indexOf('\'', begA + 1);
            let begA2 = js.indexOf('\"', cond);
            let endA2 = js.indexOf('\"', begA2 + 1);

            console.log('find argument', begA, endA, scodeEnd)


            if (begA != -1 && endA != -1 && begA < scodeEnd && endA < scodeEnd) {
              argument = js.substring(begA + 1, endA);
            } else if (begA2 != -1 && endA2 != -1 && begA2 < scodeEnd && endA2 < scodeEnd) {
              argument = js.substring(begA2 + 1, endA2);
            } else {
              e = js.length;
            }

            if (className == 'GVar') {
              const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.name == argument);
              console.log('setValue', globalVars);
              if (globalVars.length > 0) {
                js = this.replaceSubstringByIndex(js, n, scodeEnd, "\"" + globalVars[0].value + "\"")
              } else {
                js = this.replaceSubstringByIndex(js, n, scodeEnd, '\'\'');
              }
            } else if (className == 'LVar') {
              const localVars = Object.values(vm.editingTarget.variables).filter(x => x.name == argument);
              if (localVars.length > 0) {
                js = this.replaceSubstringByIndex(js, n, scodeEnd, "\"" + localVars[0].value + "\"")
              } else {
                js = this.replaceSubstringByIndex(js, n, scodeEnd, '\'\'');
              }
            }
            console.log('argument', argument);

            className = '';
          }
        }
        console.log('itog', js);

        let func = new Function(js);
        if (args.js.includes('return')) {
          const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.id == args.variable);
          console.log('vars', vm.editingTarget.variables);
          let answer = func();
          if (!this.isFloat(answer)) {
            // answer = answer;
          }
          if (globalVars.length > 0) {
            vm.runtime.getTargetForStage().variables[args.variable].value = answer;
          } else {
            vm.editingTarget.variables[args.variable].value = answer;
          }
          return 'successful';
        } else {
          func();
        }
      } catch {
        return 'error';
      }
      return 'error';
    }

    js_exec_code_ret(args) {
      console.log(args);
      try {
        console.log(args);
        let js = args.js + '';
        let n = 0; let e = 0;
        let className = '';
        let argument = '';
        let cond = -1;
        let scodeEnd = -1;
        while (true) {
          //let g = new GVar(\'my variable\'); let l = new LVar(\'my variable\'); return \'hello JavaScript! \' + g + \' \' + l;
          n = js.indexOf('new', e);
          e = n;
          console.log('new find', n);
          if (n != -1) {
            let cls1 = js.indexOf('(');
            let cls2 = js.indexOf(';');
            let cls3 = js.indexOf(' ');
            let cls4 = js.length;

            if (cls1 != -1) {
              className = js.substring(n + 4, cls1);
              className = className.replace(' ', '');
              scodeEnd = js.indexOf(')', cls1);
              cond = cls1;
              if (scodeEnd == -1) {
                break;
              }
            } else if (cls2 != -1) {
              e = cls2;
              continue;
            } else if (cls3 != -1) {
              e = cls3;
              continue;
            } else {
              break;
            }
          } else {
            break;
          }

          console.log('classname', className, 'new var', Scratch);

          if (cond != -1) {
            let begA = js.indexOf('\'', cond);
            let endA = js.indexOf('\'', begA + 1);
            let begA2 = js.indexOf('\"', cond);
            let endA2 = js.indexOf('\"', begA2 + 1);

            console.log('find argument', begA, endA, scodeEnd)


            if (begA != -1 && endA != -1 && begA < scodeEnd && endA < scodeEnd) {
              argument = js.substring(begA + 1, endA);
            } else if (begA2 != -1 && endA2 != -1 && begA2 < scodeEnd && endA2 < scodeEnd) {
              argument = js.substring(begA2 + 1, endA2);
            } else {
              e = js.length;
            }

            if (className == 'GVar') {
              const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.name == argument);
              console.log('setValue', globalVars);
              if (globalVars.length > 0) {
                js = this.replaceSubstringByIndex(js, n, scodeEnd, "\"" + globalVars[0].value + "\"");
              } else {
                js = this.replaceSubstringByIndex(js, n, scodeEnd, '\'\'');
              }
            } else if (className == 'LVar') {
              const localVars = Object.values(vm.editingTarget.variables).filter(x => x.name == argument);
              if (localVars.length > 0) {
                js = this.replaceSubstringByIndex(js, n, scodeEnd, "\"" + localVars[0].value + "\"");
              } else {
                js = this.replaceSubstringByIndex(js, n, scodeEnd, '\'\'');
              }
            }
            console.log('argument', argument);

            className = '';
          }
        }
        console.log('itog', js);

        let func = new Function(js);
        if (args.js.includes('return')) {
          const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.id == args.variable);
          console.log('vars', vm.editingTarget.variables);
          let answer = func();
          if (!this.isFloat(answer)) {
            // answer = '\'' + answer + '\'';
          }
          return answer;
        } else {
          func();
        }
      } catch {
        return 'error';
      }
      return 'error';
    }

    js_init_func(args, until) {
      console.log(args);
      let access = true;
      if (!functions.has(args.name)) {
        access = true;
      } else {
        if (args.quest == 'no') {
          access = false;
        }
      }

      if (access) {
        try {

          let vars_ = new Array;

          let js = args.js + '';
          let n = 0; let e = 0;
          let className = '';
          let argument = '';
          let cond = -1;
          let scodeEnd = -1;
          let counter = 0;
          while (true) {
            //let g = new GVar(\'my variable\'); let l = new LVar(\'my variable\'); return \'hello JavaScript! \' + g + \' \' + l;
            n = js.indexOf('new', e);
            e = n;
            console.log('new find', n);
            if (n != -1) {
              let cls1 = js.indexOf('(');
              let cls2 = js.indexOf(';');
              let cls3 = js.indexOf(' ');
              let cls4 = js.length;

              if (cls1 != -1) {
                className = js.substring(n + 4, cls1);
                className = className.replace(' ', '');
                scodeEnd = js.indexOf(')', cls1);
                cond = cls1;
                if (scodeEnd == -1) {
                  break;
                }
              } else if (cls2 != -1) {
                e = cls2;
                continue;
              } else if (cls3 != -1) {
                e = cls3;
                continue;
              } else {
                break;
              }
            } else {
              break;
            }

            console.log('classname', className, 'new var', Scratch);

            if (cond != -1) {
              let begA = js.indexOf('\'', cond);
              let endA = js.indexOf('\'', begA + 1);
              let begA2 = js.indexOf('\"', cond);
              let endA2 = js.indexOf('\"', begA2 + 1);

              console.log('find argument', begA, endA, scodeEnd)


              if (begA != -1 && endA != -1 && begA < scodeEnd && endA < scodeEnd) {
                argument = js.substring(begA + 1, endA);
                js = this.replaceSubstringByIndex(js, n, scodeEnd, '____' + counter);
                counter++;
              } else if (begA2 != -1 && endA2 != -1 && begA2 < scodeEnd && endA2 < scodeEnd) {
                argument = js.substring(begA2 + 1, endA2);
                js = this.replaceSubstringByIndex(js, n, scodeEnd, '____' + counter);
                counter++;
              } else {
                e = js.length;
              }


              if (className == 'GVar') {
                const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.name == argument);
                vars_.push({
                  variable: globalVars.length > 0 ? globalVars[0].id : 'error',
                  index: counter - 1,
                  where: 0
                });


              } else if (className == 'LVar') {
                const localVars = Object.values(vm.editingTarget.variables).filter(x => x.name == argument);
                vars_.push({
                  variable: localVars.length > 0 ? localVars[0].id : 'error',
                  index: counter - 1,
                  where: 1
                });
              }
              console.log('argument', argument);

              className = '';
            }
          }


          console.log('itog', js);

          let func = new Function('____0', '____1', '____2', '____3', '____4', '____5', '____6', '____7', '____8', '____9', '____10', '____11', '____12', '____13', '____14', '____15'
            , '____16', '____17', '____18', '____19', '____20', '____21', '____22', '____23', '____24', '____25', '____26', '____27', '____28', '____29', '____30', '____31', js);

          if (vars_.length > 32) {
            functions.set(args.name, {
              success: false,
              exec: () => { return 'error'; },
              isReturned: js.includes('return'),
              cArguments: vars_.length,
              variables: vars_
            });
          } else {
            functions.set(args.name, {
              success: true,
              exec: func,
              isReturned: js.includes('return'),
              cArguments: vars_.length,
              variables: vars_
            });
          }



        } catch {
          return 'failed';
        }
        this.SaveFunctions();
        return 'success';
      }
    }

    js_remove_func(args, util){
      functions.delete(args.name);
      this.SaveFunctions();
    }

    js_exec_code_from_func_ret(args) {
      console.log(args);

      if (functions.has(args.func)) {
        const e = functions.get(args.func);

        if (e.success) {
          let args_ = new Array;

          try {
            for (let i = 0; i < e.variables.length; i++) {
              let v;
              if (e.variables[i].where == 0) {
                v = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.id == e.variables[i].variable);
              } else {
                v = Object.values(vm.editingTarget.variables).filter(x => x.id == e.variables[i].variable);
              }

              if (v.length > 0) {
                args_.push(v[0].value);
              } else {
                args_.push("\"none\"");
              }
            }

            let ans = e.exec(...args_);

            if (e.isReturned) {
              return ans;
            } else {
              return "success";
            }

          } catch {
            return "error";
          }
          return "";
        }
      } else {
        return "error";
      }
    }

    js_exec_code_from_func(args) {
      console.log(args);

      if (functions.has(args.func)) {
        const e = functions.get(args.func);

        if (e.success) {
          let args_ = new Array;

          try {
            for (let i = 0; i < e.variables.length; i++) {
              let v;
              if (e.variables[i].where == 0) {
                v = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.id == e.variables[i].variable);
              } else {
                v = Object.values(vm.editingTarget.variables).filter(x => x.id == e.variables[i].variable);
              }

              if (v.length > 0) {
                args_.push(v[0].value);
              } else {
                args_.push("\"none\"");
              }
            }

            let ans = e.exec(...args_);

            const v2 = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.id == args.variable);
            if (v2.length > 0) {
              if (e.isReturned) {
                vm.runtime.getTargetForStage().variables[args.variable].value = ans;
              } else {

              }
            } else {
              const v3 = Object.values(vm.editingTarget.variables).filter(x => x.id == args.variable);

              if (e.isReturned) {
                vm.editingTarget.variables[args.variable].value = ans;
              } else {

              }
            }
          } catch {

          }


        }
      }
    }

    js_ret_convert_var(args, until) {
      // const v = until.target.lookupVariableById(args.variable);
      try {
        const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.id == args.variable);
        const localVars = Object.values(vm.editingTarget.variables).filter(x => x.id == args.variable);
        let v;
        let type;
        if (globalVars.length > 0) {
          v = globalVars[0];
          type = "GVar";
        } else {
          v = localVars[0];
          type = "LVar";
        }
        console.log('until', until.target.lookupVariableById(args.variable), until);
        return "let any_name_var = new " + type + "('" + v.name + "');";
      } catch {
        return 'error';
      }
    }

    js_func_is_init(args) {
      return functions.has(args.name);
    }

    js_ret_all_functions(args) {
      let ret = '';
      let one = true;
      functions.forEach((v, k) => {
        if (one) {
          ret += k;
          one = false;
        } else {
          ret += ', ' + k;
        }
      });
      return ret;
    }

    js_json_create({ name, value }) {
        try {
          let json = JSON.parse(value);
          jsons_values.set(name, json);
          return true;
        } catch {
          return false;
        }
      return false;
    }

    js_json_delete({ name }) {
      if (jsons_values.has(name)) {
        jsons_values.delete(name);
        return true;
      }
      return false;
    }

    js_json_get_var({ variable }) {
      if (variable == 'select a variable')
        return "";
      return variable;
    }

    js_json_exist({ name }) {
      return jsons_values.has(name);
    }
  }



  Scratch.extensions.register(new JSAddon());
})(Scratch);
