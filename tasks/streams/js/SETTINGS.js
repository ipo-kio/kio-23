let _s = {};

_s.BRANCHES = 2; //Количество линий, которые могут выходить из конца прошлой
_s.STACK_LIMIT = 10; //максимальное количество сохранений в stack
_s.STACK = true; //сохранине в stack изменений
_s.SHOW_PATH = false //показать путь обхода
_s.SHOW_CYCLES = false; //показать циклы
_s.CONTROL_SUM_WARNING = true; //выводить предупреждение о контрольной сумме
_s.SHOW_PRIORITIES = false;
_s.START_POWER = 2;
_s.NUMERIC_POWER = false;

_s.REDUCING_LINES = true;
_s.LINE_WIDTH_MIN = 3;
_s.LINE_WIDTH = 10;
_s.CIRCLE_RADIUS = _s.LINE_WIDTH / 2;
_s.LINE_DIVISION = 1.1;


_s.LOOPS = true;
_s.MERGES = true;
_s.FINISH_LIMITS = false; //num //arr [1, 3] - range //false = no limits
_s.TASK = ["1/4", "3/4"];
_s.ALLOW_COLLISIONS = false;
_s.SHOW_COLLISION_LINES = true;
_s.SHOW_NUMBER_OF_COLLISION = false;

const SETTINGS = {
    changeProperty(name, value){
        _s[name] = value;
    },
    getAll(){
        return this;
    },
    set(settings){
        for(let key in settings){
            if(_s.hasOwnProperty(key)){
                _s[key] = settings[key];
                if (_s[key] === 'true')
                    _s[key] = true;
                if (_s[key] === 'false')
                    _s[key] = false;
            }
        }
    }
}
for(let key in _s){
   Object.defineProperty(SETTINGS, key, {
       get: () => {return _s[key]}
   })
}

export default SETTINGS;
