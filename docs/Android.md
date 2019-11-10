## Home
Fill in the identifier corresponding to the application name.
![home1](images/home1.png)

## Hooks
Traverse all the class names of the App, match the filled string(Support for regular), meet the conditions, then **hook** all methods under the class.

match is empty,hook all classes.
![hooks1](images/hooks1.png)

Options: 
Filter the hook class name, and if it matches, do not hook the matching class
![hooks2](images/hooks2.png)


## Stack
The Hooks printed stack is shown here.
![stack1](images/stack1.png)

## Finds
Traverse all the class names of the App, match the filled string(Support for regular), meet the conditions, then **print** all methods under the class.
![finds1](images/finds1.png)

Options: 
Filter the finds class name, and if it matches, do not print the matching class

![finds2](images/finds2.png)

### Searchmethod
Search for matching methods based on the filled string(Support for regular).
![searchmethod1](images/searchmethod1.png)

### search
Find the string containing Util in the printed information, which is case-insensitive.
![search](images/search.png)

## UIDump
Monitor Activity.
![uidump1](images/uidump1.png)

## toBurp
PakageName.ClassName.MethodName
![toBurp1](images/toBurp1.png)

export static: rpc static method.
export instance: rpc instance method.

hook-call:
Execute the APP method
![toburphook](images/toburphook.gif)

With the Burp plugin, automatic encryption and decryption of packets can be achieved. 

![GIF](images/post.gif)

Notice:**When using Body Auto, the tag used when the request package is automatically encrypted is req fun1. When the package is returned for decryption, the tag used is req fun2**


### toBurp-toBurp
Intercepts the specified function, modifies the or return value, and returns it to the application.

Complex data types only support modifying one-dimensional arrays.
![toburp-toburp](images/toburp-toburp.gif)


## Decoder
Support byte[] and string conversion, byte[] and hexadecimal string conversion.
![Decoder1](images/Decoder1.png)

![Decoder2](images/Decoder2.png)