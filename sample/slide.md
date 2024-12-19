# Slide test
Some text

---

## Slide 1

Quadratic formula: ``x = (-b +- sqrt(b^2 - 4ac))/(2a)``

Drawing
```bob

  ^
 /
/
```


---

## Slide 2
Very simple points
- Uses markdown
- Has preprocessor magic, allowing ``tex"\LaTeX"``

---

## Slide 3
```python
def dump_args(func):
    "This decorator dumps out the arguments passed to a function before calling it"
    argnames = func.func_code.co_varnames[:func.func_code.co_argcount]
    fname = func.func_name     # This is a comment
    print(2 + 3)
    def echo_func(*args,**kwargs):
        print fname, ":", ', '.join(
            '%s=%r' % entry
            for entry in zip(argnames,args) + kwargs.items())
        return func(*args, **kwargs)  # And this too
    return echo_func

@dump_args
def f1(a,b,c):
    print a + b + c

f1(1, 2, 3)

def precondition(precondition, use_conditions=DEFAULT_ON):
    return conditions(precondition, None, use_conditions)

def postcondition(postcondition, use_conditions=DEFAULT_ON):
    return conditions(None, postcondition, use_conditions)

class conditions(object):
    __slots__ = ('__precondition', '__postcondition')

    def __init__(self, pre, post, use_conditions=DEFAULT_ON):
        if not use_conditions:
            pre, post = None, None
```

---

## Slide 4
```cpp
#include "algostuff.hpp"
using namespace std;

bool bothEvenOrOdd (int elem1, int elem2)
{
    return elem1 % 2 == elem2 % 2;
}

int main()
{
    vector<int> coll1;
    list<int> coll2;

    float m = 40.0f;

    INSERT_ELEMENTS(coll1,1,7);
    INSERT_ELEMENTS(coll2,3,9);

    PRINT_ELEMENTS(coll1,"coll1: \n");
    PRINT_ELEMENTS(coll2,"coll2: \n");

    // check whether both collections are equal
    if (equal (coll1.begin(), coll1.end(),  // first range
               coll2.begin())) {            // second range
        cout << "coll1 == coll2" << endl;
    } /* TODO Shouldn't there be an 'else' case? */

}
```
