# ES6 模块加载：比你想的更复杂
原文：https:www.nczonline.net_blog/2016/04_es6-module-loading-more-complicated-than-you-think/

标题：ES6 模块加载：比你想的更复杂（By Nicholas C. Zakas 书籍《JS高程》的作者）
ES6 的 Modules 是一项大家等了很久的功能。在以前，JS 开发者很费力地组织代码，并且要用 RequireJS、AMD、或者 CommonJS 中的一种。ES6 的模块将终结这些。但到现在，对于模块到底是如何工作还有很多不清楚的地方。现在还没有哪个 JS 引擎原生支持模块加载。我希望这篇文章能澄清这些不清楚的地方。

## 什么是模块？
首先，很重要的一点，JS 规范定义了两种类型的 JS 程序：scripts（从 JS 诞生开始就在使用的），模块（在 ES6 中新增加的）。scripts 的行为就是大家用的那样，模块的行为有些不同。具体来说：
1. 不需要任何说明就是运行在严格模式
2. 有一个顶级作用域，但又不是全局作用域
3. 使用 import 关键词引入模块
4. 要在其它模块使用的部分要用 export 关键词导出
这些不同看起来很细微，但实际上，会让模块的解析和加载和scripts相比非常不一样

## 解析的不同
在 ESLint 上，关于 ES6 的模块，问得最多的是：
为什么我必须得注明一个文件是模块，而不是自动查找 import 和 export 关键词来判断文件是不是模块
这个问题我在网上看到无数遍。大家很想知道为什么 JS 引擎和相关工具不能自动检测一个JS文件是模块还是script。第一眼看，好像只要检测 export 和 import 关键词就能判断。但实际上，还远远不够。
猜测用户的目的是危险又不精确的。如果你猜对了，全世界都会给你鼓掌，但如果猜错了，可能会造成巨大的破坏。

### 解析的挑战
为了自动检测一个JS是不是模块，你首先要解析完整个文件。模块可能没有import 关键词，所以唯一的标识就是在文件底部声明的 export。要判断是不是模块，完整地解析一个文件是少不了的。
模块都是运行在严格模式的环境下，严格模式不仅有运行时的要求，还有以下情况要报语法错误：
1. 有 with 语句
2. 函数中有重复的形参
3. 有像010这样的八进制数
4. 有重复的属性名（只在 ES5 下，ES6 取消了这个错误）
5. 用以下关键词作为标识符：implements, interface, let, package, private, protected, public, static, yield
如果不是运行在严格模式，以上这些都不是语法错误。如果唯一的标识是为文件底部的 export ，那就要重新解析整个文件，确保以上的语法错误都会抛出来。第一次的非严格模式的解析就浪费了。
当然，如果你非得从文件内容来检测是否是模块，你不得不将所有文件都当作模块来解析。因为模块都运行在严格模式下，另外还有 import 和 export 会被使用，你需要默认使用严格模式来解析所有文件。如果你在非严格模式下解析，import 和 export 就是语法错误。你也可以创建一个将非严格模式和 import、export 结合起来的解析模式，但这是非正常的解析模式，解析结果没有用，因此，正确的模式确定好后，一定要个解析第二次。

### 到底什么才是模块
在关于模块的讨论中，有一个特殊例子被忽略了，那就是，模块不要求一定要用 import 和 export 语句。你可以写一个模块，没有import任何模块，也没有export 任何东西。例如，当你只是想修改全局变量的一些东西的时候，就像这样：在触发 window.onload 事件时，你想输出一条消息，你的模块像这样：
```
// this is a valid module!

window.addEventListener("load", function() {
    console.log("Window is loaded");
});
```
这个模块可以被其它模块引入，也可以自己加载。从代码上来看，无法看出它是一个模块。
总结：有 import 和 export 可能是一个模块；没有 import 和 export 也可能是个模块。所以，没有有效的方法可以从文件内容来判断一个文件是否是模块。

## 加载的困难
模块的解析和普通JS的解析有细微的区别，但这两者的加载的区别就不细微了。当一个模块被加载后，import 语句又会触发其它文件的加载。被加载的文件必须被无错误地加载和以模块的方式正确地解析完。为了让这个尽快完成，加载必须在遇到 import 语句就开始，比import后面的部分更快解析。
一旦这个依赖的文件加载好了，有额外的一部验证是确保import 的部分在依赖中确实存在，如果你 import foo 从 foo.js，那JS引擎需要验证foo从foo.js中export出来了。

## 加载会怎样进行
在这点上，希望你已经清楚为什么在加载和解析之前需要注明一个文件是模块。在浏览器中，你会这样加载一个模块：
```
<script type="module" src="foo.js"></script>
```
<script> 标签和以前一样，但 type 属性要设置成 module。这个标注告诉浏览器这个文件要被当做模块来加载。如果 foo.js 引入其它模块，那这些模块要动态地加载。
在Node.js中，还没决定如何加载 ES6 模块。最近的提议是用一个特别的文件后缀，比如 .jsm，来标示这是个 ES6 模块，好让 Node.js 知道怎样正确地加载它。

## 总结
对开发者来说，普通JS和模块之间的细微区别。
The differences between scripts and modules are subtle enough that it's hard for developers to understand the restriction of declaring what a JavaScript file represents ahead of time. My hope is that this post clarifies some of the reasons why it's not possible to autodetect modules from inspecting the source code and why tools such as ESLint ask you to specify the file type before executing. There will be a point in the future where ES6 modules are the dominant JavaScript file type and script files are left only on legacy applications, and at that point, it's likely that tools will default to assuming that files are modules. In the meantime, we're going through a difficult adolescence between scripts and modules where mixing the two is going to be a bit painful.



