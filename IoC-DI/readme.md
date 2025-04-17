IoC控制反转和DI依赖注入
控制反转（Inversion of Control，IoC）和依赖注入（Dependency Injection，DI）是软件开发中常用的设计模式和技术，用于解耦和管理组件之间的依赖关系。虽然它们经常一起使用，但它们是不同的概念。


控制反转（IoC）是一种设计原则，它将组件的控制权从组件自身转移到外部容器。传统上，组件负责自己的创建和管理，而控制反转则将这个责任转给了一个外部的容器或框架。容器负责创建组件实例并管理它们的生命周期，组件只需声明自己所需的依赖关系，并通过容器获取这些依赖。这种反转的控制权使得组件更加松耦合、可测试和可维护。


依赖注入（DI）是实现控制反转的一种具体技术。它通过将组件的依赖关系从组件内部移动到外部容器来实现松耦合。组件不再负责创建或管理它所依赖的其他组件，而是通过构造函数、属性或方法参数等方式将依赖关系注入到组件中。依赖注入可以通过构造函数注入（Constructor Injection）、属性注入（Property Injection）或方法注入（Method Injection）等方式实现。

package.json解析
dto验证
class-transformer 用于将对象数据转成类实例数据
class-validator 用于验证dto数据
inversify 用于IoC和DI
reflect-metadata inversify依赖的满血版的反射功能，用于获取类属性的元数据
inversify-express-utils 用于将express和inversify结合起来，实现路由和控制器的自动注册（依赖注入）
@types/node 用于nodejs内部模块的类型支持，方便typescript提示和编译

<!-- 装饰器 -->
<!-- 装饰器执行顺序
首先执行实例相关：参数装饰器 > 方法装饰器 > 类装饰器 > 属性装饰器
然后执行静态相关：参数装饰器 > 方法装饰器 > 类装饰器 > 属性装饰器
多个装饰器装饰同一个数据时，从下往上依次执行
结果从上往下应用（函数返回的最终结果） -->
通过类装饰器能够获取到类的构造函数，通过Object.getOwnPropertyNames获取到存在类的构造函数原型上的所有属性（方法）
通过方法装饰器能够获取到构造函数的原型、方法的名称、方法的属性描述符（等同于Object.getOwnPropertyDescriptor()获取属性描述对象）
通过参数装饰器能够获取到构造函数的原型、参数的名称、参数的索引

<!-- 反射 reflect-metadata -->
可以为对象或对象的属性定义元数据
给对象添加元数据：
Reflect.defineMetadata(metadataKey, metadataValue, target)
给对象上的属性添加元数据：
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)
第一个参数为定义元数据的key；第二个参数为定义元数据的value；第三个参数为定义的对象；如果是定义在属性上面，就需要第四个参数，为属性名称。

取数据
如果是对象：
Reflect.getMetadata('metadataKey', 'target')

如果是对象上的属性：
Reflect.getMetadata('metadataKey', 'target', 'propertyKey')

原理：
'reflect-metadata' 是在内部定义了一个 weakmap 将对象和定义的值做了映射

<!-- 装饰器与反射 -->
通过方法装饰器和反射为路由处理函数添加路由信息、请求方式元数据
再在类装饰器中通过反射拿到类中方法（路由处理函数）的元数据，进行路由注册（通过路由实例）

这差不多就是装饰器管理路由的实现

passport passport是一个流行的用于身份验证和授权的Node.js库
passport-jwt Passport-JWT是Passport库的一个插件，用于支持使用JSON Web Token (JWT) 进行身份验证和授权
jsonwebtoken 生成token的库
通过passport和passport-jwt校验jsonwebtoken

rest client vscode接口测试插件，通过编写.http文件来测试接口