var _ = require('lodash');
var Variables = require('./Variables');

module.exports = (function Java() {
    var Java = function() {
        var indent = 0;
        this.variables = new Variables();
    };
    Java.prototype.newLine = function() {
        var out = "\n";
        for(var i=0; i<this.indent; i++) {
            out += "    ";
        }
        return out;
    };
    Java.prototype.methodSignature = function(methodName, method, indent) {
      try {
        var out = "";
        this.variables.enterBlock();
        this.indent = indent;
        out += this.newLine();
        out += 'public '
        if(method.return == null) {
          out += 'void';
        } else {
          out += method.return.type;
        }
        out += ' ';
        out += methodName;
        out += '(';
        var isFirstParam = true;
        for (var paramName in method.params) {
          var param = method.params[paramName];
          if (isFirstParam) {
            isFirstParam = false;
          } else {
            out += ', ';
          }
          out += param.type + ' ' + paramName;
        }
        out += ');';
        this.variables.exit();
        return out;
      } catch(e) {
        console.log(e);
        throw e;
      }
    };
    Java.prototype.method = function(methodName, method, indent) {
      try {
        var out = "";
        this.variables.enterBlock();
        this.indent = indent;
        out += this.newLine();
        out += 'public '
        if(method.return == null) {
          out += 'void';
        } else {
          out += method.return.type;
        }
        out += ' ';
        out += methodName;
        out += '(';
        var isFirstParam = true;
        for(var paramName in method.params) {
            var param = method.params[paramName];
            if(isFirstParam) {
                isFirstParam = false;
            } else {
                out += ', ';
            }
            out += param.type + ' ' + paramName;
        }
        out += ') {';
        this.indent++;
        out += this.analyze(method.body, true);
        this.indent--;
        out += this.newLine();
        out += '}';
        this.variables.exit();
        return out;
      } catch(e) {
        console.log(e);
        throw e;
      }
    };
    Java.prototype.methodBody = function(methodName, methodBody, indent) {
      try {
        var out = "";
        this.variables.enterBlock();
        this.indent = indent;
        out += this.analyze(methodBody, true);
        out += this.newLine();
        this.variables.exit();
        return out;
      } catch(e) {
        console.log(e);
        throw e;
      }
    };
    Java.prototype.analyze = function(elt, addEndLine) {
        var out = "";
        if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(addEndLine) {
                    out += this.newLine();
                }
                out += this.analyze(elt2);
                if(addEndLine) {
                    out += ";";
                }
            }
        }
        else if(typeof elt === 'string') {
            if(addEndLine) {
                out += this.newLine();
            }
            out += elt;
            if(addEndLine) {
                out += ";";
            }
        } else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(addEndLine) {
                    out += this.newLine();
                }
                if(eltName2 == 'type') {
                    out += this.type(elt2, eltName2);
                }
                else if(eltName2 == 'def') {
                    out += this.def(elt2, eltName2);
                }
                else if(eltName2 == 'assign') {
                    out += this.assign(elt2, eltName2);
                }
                else if(eltName2 == 'new') {
                    out += this.new(elt2, eltName2);
                }
                else if(eltName2 == 'return') {
                    out += this.return(elt2, eltName2);
                }
                else if(eltName2 == 'increment') {
                    out += this.increment(elt2, eltName2);
                }
                else if(eltName2 == 'decrement') {
                    out += this.decrement(elt2, eltName2);
                }
                else if(eltName2 == 'if') {
                    out += this.if(elt2, eltName2);
                }
                else if(eltName2 == 'for') {
                    out += this.for(elt2, eltName2);
                }
                else if(eltName2 == 'forin') {
                    out += this.forin(elt2, eltName2);
                }
                else if(eltName2 == 'isDefined') {
                    out += this.isDefined(elt2, eltName2);
                }
                else if(eltName2 == 'isNotDefined') {
                    out += this.isNotDefined(elt2, eltName2);
                }
                else if(eltName2 == 'isLower') {
                    out += this.isLower(elt2, eltName2);
                }
                else if(eltName2 == 'isGreater') {
                    out += this.isGreater(elt2, eltName2);
                }
                else if(eltName2 == 'integer') {
                    out += this.integer(elt2, eltName2);
                }
                else if(eltName2 == 'string') {
                    out += this.string(elt2, eltName2);
                }
                else if(eltName2 == 'call') {
                    out += this.call(elt2, eltName2);
                }
                else {
                    out += eltName2;
                    out += this.analyze(elt2);
                }
                if(addEndLine) {
                    out += ";";
                }
            }
        }
        return out;
    };
    Java.prototype.getType = function(elt2) {
        if(typeof elt2 == 'string') {
            if (elt2 == 'string') {
                return "String";
            }
            else if (elt2 == 'integer') {
                return "Integer";
            }
            else {
                return elt2;
            }
        } else {
            for(var eltName3 in elt2) {
                var elt3 = elt2[eltName3];
                if (eltName3 == 'string') {
                    return "String";
                }
                else if (eltName3 == 'integer') {
                    return "Integer";
                }
                else if(eltName3 == 'list') {
                    return "List<" + elt3 + ">";
                }
                else if(elt3 == 'new') {
                    return eltName3;
                } else {
                    return elt2;
                }
            }
        }
    };
    Java.prototype.type = function(elt, eltName) {
        var out = "";
        for(var eltName2 in elt) {
            var elt2 = elt[eltName2];
            var variable = this.variables.get(eltName2);
            if (variable == null) {
                out += this.getType(elt2) + " ";
                this.variables.set(eltName2, elt2);
            }
            out += eltName2;
        }
        return out;
    };
    Java.prototype.new = function(elt, eltName) {
        var out = "new ";
        if(typeof elt == 'string') {
            out += elt;
        } else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(eltName2 == 'list') {
                    out += "ArrayList<";
                    out += elt2;
                    out += ">";
                    out += "()";
                }
            }
        }
        return out;
    };
    Java.prototype.def = function(elt, eltName) {
        var out = "";
        if(typeof elt === 'string') {
            out += elt;
        }
        else {
            for (var eltName2 in elt) {
                var elt2 = elt[eltName2];
                var variable = this.variables.get(eltName2);
                if (typeof elt2 === 'string') {
                    if (variable == null) {
                        out += this.getType(elt2) + " ";
                        this.variables.set(eltName2, elt2);
                    }
                    out += eltName2;
                } else {
                    for (var eltName3 in elt2) {
                        var elt3 = elt2[eltName3];
                        if (variable == null) {
                            out += this.getType(elt2) + " ";
                            this.variables.set(eltName2, elt2);
                        }
                        out += eltName2;
                        out += " = ";
                        if (eltName3 == 'integer') {
                            out += this.integer(elt3);
                        }
                        else if (eltName3 == 'string') {
                            out += this.string(elt3);
                        }
                        else if (eltName3 == 'list') {
                            out += this.new(elt2);
                        }
                        else if (elt3 == 'new') {
                            out += "new ";
                            out += eltName3;
                            out += "()"
                        }
                        else {
                            out += this.analyze(elt2);
                        }
                    }
                }
            }
        }
        return out;
    };
    Java.prototype.assign = function(elt, eltName) {
        var out = "";
        for(var eltName2 in elt) {
            var elt2 = elt[eltName2];
            out += eltName2;
            out += " = ";
            out += this.analyze(elt2);
        }
        return out;
    };
    Java.prototype.return = function(elt, eltName) {
        var out = "";
        out += "return ";
        out += this.analyze(elt);
        return out;
    };
    Java.prototype.if = function(elt, eltName) {
        this.variables.enterBlock();
        var out = "if(";
        for(var i=0; i<elt['condition'].length; i++) {
            var elt2 = elt['condition'][i];
            out += this.analyze(elt2);
        }
        out += ") {";
        this.indent++;
        out += this.analyze(elt['body'], true);
        this.indent--;
        out += this.newLine();
        out += "}";
        this.variables.exit();
        return out;
    };
    Java.prototype.for = function(elt, eltName) {
        this.variables.enterBlock();
        var out = "for(";
        out += this.analyze(elt['from']);
        out += "; ";
        out += this.analyze(elt['to']);
        out += "; ";
        out += this.analyze(elt['iter']);
        out += ") {";
        this.indent++;
        out += this.analyze(elt['body'], true);
        this.indent--;
        out += this.newLine();
        out += "}";
        this.variables.exit();
        return out;
    };
    Java.prototype.forin = function(elt, eltName) {
        this.variables.enterBlock();
        var out = "for(";
        out += this.analyze(elt['var']);
        out += " : ";
        out += this.analyze(elt['in']);
        out += ") {";
        this.indent++;
        out += this.analyze(elt['body'], true);
        this.indent--;
        out += this.newLine();
        out += "}";
        this.variables.exit();
        return out;
    };
    Java.prototype.increment = function(elt, eltName) {
        var out = elt+"++";
        return out;
    };
    Java.prototype.decrement = function(elt, eltName) {
        var out = elt+"--";
        return out;
    };
    Java.prototype.isDefined = function(elt, eltName) {
        var out = elt+" != null";
        return out;
    };
    Java.prototype.isNotDefined = function(elt, eltName) {
        var out = elt+" == null";
        return out;
    };
    Java.prototype.isGreater = function(elt, eltName) {
        var out;
        for(var eltName2 in elt) {
            var elt2 = elt[eltName2];
            out = elt2 + " > " + eltName2;
        }
        return out;
    };
    Java.prototype.isLower = function(elt, eltName) {
        var out;
        for(var eltName2 in elt) {
            var elt2 = elt[eltName2];
            out = elt2 + " < " + eltName2;
        }
        return out;
    };
    Java.prototype.integer = function(elt, eltName) {
        var out = "Integer.valueOf("+elt+")";
        return out;
    };
    Java.prototype.string = function(elt, eltName) {
        var out = "\""+elt+"\"";
        return out;
    };
    Java.prototype.call = function(elt, eltName) {
        var out = "";
        if(typeof elt === 'string') {
            out += elt + "()";
        } else if(elt instanceof Array) {
            var isFirst = true;
            for(var i=0; i<elt.length; i++) {
                if(!isFirst) {
                    out += ".";
                }
                if(typeof elt[i] == 'string') {
                    if(isFirst || elt.length == 1) {
                        out += elt[i];
                    } else {
                        out += elt[i] + "()";
                    }
                }
                else {
                    var eltIName = Object.keys(elt[i])[0];
                    out += eltIName;
                    out += "(";
                    if(elt[i][eltIName] == null) {
                    }
                    else if(elt[i][eltIName] instanceof Array) {
                        for(var j=0; j<elt[i][eltIName].length; j++) {
                            var elt3 = elt[i][eltIName][j];
                            out += this.analyze(elt3);
                        }
                    }
                    else {
                        out += elt[i][eltIName];
                    }
                    out += ")";
                }
                if(isFirst) {
                    isFirst = false;
                }
            }
        }
        return out;
    };
    Java.prototype._ = function(elt, eltName) {
        var out = "";
        return out;
    };
    return Java;
})();