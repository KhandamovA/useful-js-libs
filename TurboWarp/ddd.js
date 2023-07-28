(function (Scratch) {
  'use strict';
  /*
  * JsAddon extension v1.0 by KhandamovA
  */

  let functions = new Map;

  let jsons_values = new Map;

  /**
   * @type {Array}
   */
  let dataStorage;

  let labelblock = (text) => ({
    blockType: Scratch.BlockType.LABEL,
    text: text
  });

  let buttonblock = (text, method_name) => ({
    opcode: method_name,
    blockType: Scratch.BlockType.BUTTON,
    text: text
  });



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
                defaultValue: 'TestFunction'
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
                defaultValue: 'TestFunction'
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
            text: 'create json variable [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myJson'
              }
            }
          },
          {
            opcode: 'js_json_delete',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete json variable [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myJson'
              }
            }
          },
          {
            opcode: 'js_json_exist',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'json variable [name] exist?',
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
            text: 'get json key [variable]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                menu: 'get_jsons'
              }
            }
          },
          {
            opcode: '',
            blockType: Scratch.BlockType.REPORTER,
            text: '[variable] as object',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              }
            }
          },
          {
            opcode: '',
            blockType: Scratch.BlockType.REPORTER,
            text: '[variable] as array',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              }
            }
          },
          {
            opcode: '',
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
            opcode: '',
            blockType: Scratch.BlockType.REPORTER,
            text: '[variable] get [param] object param',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              param: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'param'
              }
            }
          },
          {
            opcode: '',
            blockType: Scratch.BlockType.REPORTER,
            text: '[variable] get #[param] array elem',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              param: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
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
          }
        }
      };
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

    init() {
      dataStorage = vm.runtime.getTargetForStage().lookupOrCreateList('KhandamovADataStorage', 'JsAddon:Storage').value;

      try {
        for (let i = 0; i < dataStorage.length; i++) {
          const v = dataStorage[i];
          if (v == '$restore_json') {
            let name = dataStorage[i + 1];
            let json = dataStorage[i + 2];
            i += 2;
            jsons_values.set(name, JSON.parse(json));
          }

        }
      } catch {

      }
    }

    deleteAllJsons(){
      let e = 0;
      while(true){
        let index = dataStorage.indexOf('$restore_json', e);
        e = index + 1;
        if(index == -1){
          break;
        }else{
          dataStorage.splice(index, 3);
        }
      }
    }

    deleteOneJsons(key){
      let e = 0;
      while(true){
        let index = dataStorage.indexOf('$restore_json', e);
        e = index + 1;
        if(index == -1){
          break;
        }else{
          if(dataStorage[index + 1] == key){
            dataStorage.splice(index, 3);
            break;
          }
        }
      }
    }

    saveJsons(){
      this.deleteAllJsons();

      jsons_values.forEach((v, k)=>{
        dataStorage.push('$restore_json');
        dataStorage.push(k);
        dataStorage.push(JSON.stringify(v));
      });
    }

    getVars() {
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
      jsons_values.forEach((v, k)=>{
        res.push({
          text : k.substring(1, k.length),
          value : k.substring(1, k.length)
        })
      });

      if(res.length == 0){
        return [{
          text: 'select a variable',
          value: 'select a variable'
        }]
      }else{
        return res;
      }
    }

    button(args, until) {
      console.log('click!!!');
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
        return 'success';
      }
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

    js_json_create({name}){
      if(!jsons_values.has("j" + name)){
        jsons_values.set("j" + name, {});
        return true;
      }
        return false;
    }

    js_json_delete({name}){
      if(jsons_values.has("j" + name)){
        jsons_values.delete("j" + name);
        return true;
      }
      return false;
    }

    js_json_get_var({variable}){
      if(variable ==  'select a variable')
      return "";
      return variable;
    }

    js_json_exist({name}){
      return jsons_values.has(name);
    }
  }



  Scratch.extensions.register(new JSAddon());
})(Scratch);
