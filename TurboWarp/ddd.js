(function(Scratch) {
    'use strict';
    /*
    * JSON extension v2.5 by skyhigh173 (English Version)
    * Do not remove this comment
    */
  
    const vm = Scratch.vm;

    var buffer = 'test';
  
    class JSAddon {
      getInfo() {
        return {
          id: 'Yuki1209',
          name: 'JsAddon',
          color1: '#4d0092',
          blocks: [
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
                  defaultValue: 'let g = new GVar(\'my variable\'); let l = new LVar(\'my variable\') return \'hello JavaScript! \' + g + \' \' + l;'
                },
              }
            },
          ],
          menus: {
            get_vars: {
              acceptReporters: true,
              items: 'getVars'
            }
          }
        };
      }

      replaceSubstringByIndex(inputString, startIndex, endIndex, replacement) {
        if (startIndex < 0 || endIndex >= inputString.length || startIndex > endIndex) {
          return "";
        }
      
        const firstPart = inputString.slice(0, startIndex);
        const secondPart = inputString.slice(endIndex + 1);
        return firstPart + replacement + secondPart;
      }
      
  
      getVars () {
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

      js_exec_code(args){
        console.log(args.js);
        try{
            console.log(args);
                let js = args.js + '';
                let n = 0; let e = 0;
                let className = '';
                let argument = '';
                let cond = false;
                let scodeEnd = -1;
                while(true){
                    //let g = new GVar(\'my variable\'); let l = new LVar(\'my variable\') return \'hello JavaScript! \' + g + \' \' + l;
                    n = js.indexOf('new', e);
                    console.log('new find', n);
                    if(n != -1){
                        let cls1 = js.indexOf('(');
                        let cls2 = js.indexOf(';');
                        let cls3 = js.indexOf(' ');
                        let cls4 = js.length;
                        cond = true;
                        if(cls1 != -1){
                            className = js.substring(n + 4, cls1);
                            className = className.replace(' ', '');
                            scodeEnd = js.indexOf(')', cls1);
                            if(scodeEnd == -1){
                                break;
                            }
                        }else if (cls2 != -1){
                            e = cls2;
                            continue;
                        }else if(cls3 != -1){
                            e = cls3;
                            continue;
                        }else{
                            break;
                        }
                    }else{
                        break;
                    }

                    console.log('classname', className, cls1);

                    if(cls1 != -1){
                        let begA = js.indexOf('\'', cls1);
                        let endA = js.indexOf('\'', begA + 1);
                        let begA2 = js.indexOf('\"', cls1);
                        let endA2 = js.indexOf('\"', begA + 1);

                        console('find argument', begA, endA, scodeEnd)

                        
                        if(begA != -1 && endA != -1 && begA < scodeEnd && endA < scodeEnd){
                            argument = js.substring(begA + 1, endA);
                        }else if(begA2 != -1 && endA2 != -1 && begA2 < scodeEnd && endA2 < scodeEnd){
                            argument = js.substring(begA2 + 1, endA2);
                        }else{
                            e = js.length;
                        }

                        if(className == 'GVar'){
                            const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter(x => x.name != argument);
                            console.log('setValue', globalVars);
                            if(globalVars.length > 0){
                                js = this.replaceSubstringByIndex(js, n, scodeEnd, globalVars[0].value)
                            }else{
                                js = this.replaceSubstringByIndex(js, n, scodeEnd, 'null');
                            }
                        }else if(className == 'LVar'){
                            const localVars = Object.values(vm.editingTarget.variables).filter(x => x.name != argument);
                            if(localVars.length > 0){
                                js = this.replaceSubstringByIndex(js, n, scodeEnd, localVars[0].value)
                            }else{
                                js = this.replaceSubstringByIndex(js, n, scodeEnd, 'null');
                            }
                        }
                        console.log('argument', argument);

                        className = '';
                    }
                }
                console.log('itog', js);

                let func = new Function(js);
                if(args.js.includes('return')){
                    vm.runtime.getTargetForStage().variables[args.variable].value = func();
                }else{
                    func();
                }
        }catch{
            return '';
        }
        return '';
      }
    }



    Scratch.extensions.register(new JSAddon());
  })(Scratch);
  