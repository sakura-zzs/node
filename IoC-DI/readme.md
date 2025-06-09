# node高级
## IoC控制反转和DI依赖注入
- 控制反转（Inversion of Control，IoC）和依赖注入（Dependency Injection，DI）是软件开发中常用的设计模式和技术，用于解耦和管理组件之间的依赖关系。虽然它们经常一起使用，但它们是不同的概念。
- 控制反转（IoC）是一种设计原则，它将组件的控制权从组件自身转移到外部容器。传统上，组件负责自己的创建和管理，而控制反转则将这个责任转给了一个外部的容器或框架。容器负责创建组件实例并管理它们的生命周期，组件只需声明自己所需的依赖关系，并通过容器获取这些依赖。这种反转的控制权使得组件更加松耦合、可测试和可维护。
- 依赖注入（DI）是实现控制反转的一种具体技术。它通过将组件的依赖关系从组件内部移动到外部容器来实现松耦合。组件不再负责创建或管理它所依赖的其他组件，而是通过构造函数、属性或方法参数等方式将依赖关系注入到组件中。依赖注入可以通过构造函数注入（Constructor Injection）、属性注入（Property Injection）或方法注入（Method Injection）等方式实现。

## package.json解析
- dto验证
- class-transformer 用于将对象数据转成类实例数据
- class-validator 用于验证dto数据
- inversify 用于IoC和DI
- reflect-metadata inversify依赖的满血版的反射功能，用于获取类属性的元数据
- inversify-express-utils 用于将express和inversify结合起来，实现路由和控制器的自动注册（依赖注入）
- @types/node 用于nodejs内部模块的类型支持，方便typescript提示和编译

## 装饰器
### 装饰器执行顺序
- 首先执行实例相关：参数装饰器 > 方法装饰器 > 类装饰器 > 属性装饰器
- 然后执行静态相关：参数装饰器 > 方法装饰器 > 类装饰器 > 属性装饰器
- 多个装饰器装饰同一个数据时，从下往上依次执行
- 结果从上往下应用（函数返回的最终结果）
### 使用
- 通过类装饰器能够获取到类的构造函数，通过Object.getOwnPropertyNames获取到存在类的构造函数原型上的所有属性（方法）
- 通过方法装饰器能够获取到构造函数的原型、方法的名称、方法的属性描述符（等同于Object.getOwnPropertyDescriptor()获取属性描述对象）
- 通过参数装饰器能够获取到构造函数的原型、参数的名称、参数的索引
  
## 反射 reflect-metadata
### 添加数据
- 可以为对象或对象的属性定义元数据
- 给对象添加元数据：
  - Reflect.defineMetadata(metadataKey, metadataValue, target)
- 给对象上的属性添加元数据：
  - Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)
- 第一个参数为定义元数据的key；第二个参数为定义元数据的value；第三个参数为定义的对象；如果是定义在属性上面，就需要第四个参数，为属性名称。
  
### 取数据
- 如果是对象：
  - Reflect.getMetadata('metadataKey', 'target')

- 如果是对象上的属性：
  - Reflect.getMetadata('metadataKey', 'target', 'propertyKey')

- 原理：
  - 'reflect-metadata' 是在内部定义了一个 weakmap 将对象和定义的值做了映射

## 装饰器与反射
- 通过方法装饰器和反射为路由处理函数添加路由信息、请求方式元数据
- 再在类装饰器中通过反射拿到类中方法（路由处理函数）的元数据，进行路由注册（通过路由实例）
- 这差不多就是装饰器管理路由的实现

## jwt
- passport 
  - passport是一个流行的用于身份验证和授权的Node.js库
- passport-jwt 
  - Passport-JWT是Passport库的一个插件，用于支持使用JSON Web Token (JWT) 进行身份验证和授权
- jsonwebtoken 
  - 生成token的库
- 通过passport和passport-jwt校验jsonwebtoken

## vscode插件
### rest client 
- vscode接口测试插件，通过编写.http文件来测试接口
### database client 
- 数据库可视化工具

## redis
1. windows 安装 
   1. https://github.com/zkteco-home/redis-windows/releases/tag/7.4.2.1
2. 将安装目录配置到环境变量中
3. 添加到windows服务(cmd管理员模式)
   1. redis-server.exe --service-install redis.conf --loglevel verbose，redis.conf为配置文件路径
### wsl
- redis官方没有提供windows版本，我们需要通过wsl基于虚拟机运行完整的 Linux 内核，完美支持 Redis 的运行
1. 安装 wsl --install
2. 打开Microsoft Store 搜索 wsl 安装一个ubuntu
3. 启动ubuntu跟着官网的命令安装和启动redis
   1. https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/
4. linux启动 sudo service redis-server start
   1. windows启动 redis-server
5. 进入redis：redis-cli

### 配置在Windows上访问WSL的Redis服务
1. 配置Redis支持局域网访问
   - 修改/etc/redis/redis.conf文件：
   - ```shell
     # 注释掉下面的配置
       # bind 127.0.0.1 ::1
     # 修改下面的配置为no
       protected-mode no 
       
     ```
   - 然后重启redis服务。
2. 在windows上配置端口转发和防火墙允许入站规则
   - 使用管理员权限运行PowerShell并执行命令：
   - ```shell
     # 查询 WSL 2 IP 地址
      PS C:\Users\Liyan> wsl -- hostname -I
      172.24.27.46

     # 配置端口转发：外网访问 windows 8080 端口转发到 172.19.42.138:8080
      PS C:\Users\Liyan> netsh interface portproxy add v4tov4 listenport=6379 connectaddress=172.24.27.46 connectport=6379

     # 添加允许入站规则
      PS C:\Users\Liyan> New-NetFirewallRule -DisplayName "Allow Inbound TCP Port 6379" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 6379

     ```
3. 重启电脑
4. 删除上述配置
   ```shell
    # 删除端口转发规则
    netsh interface portproxy delete v4tov4 listenport=6379
    # 删除防火墙入站规则
    Remove-NetFirewallRule -DisplayName "Allow Inbound TCP Port 6379"
   ```

### redis基本使用

#### 字符串操作
##### 添加
- SET key value [NX|XX] [EX seconds] [PX milliseconds] [GET]
  - key：要设置的键名。
  - value：要设置的值。
  - NX：可选参数，表示只在键不存在时才设置值。
  - XX：可选参数，表示只在键已经存在时才设置值。
  - EX seconds：可选参数，将键的过期时间设置为指定的秒数。
  - PX milliseconds：可选参数，将键的过期时间设置为指定的毫秒数。
  - GET：可选参数，返回键的旧值。
- 例：SET message "Hello" NX GET 不存在时设置键名为 "message" 的值为 "Hello"，并返回旧的值：
##### 删除
- DEL name1 name2 name3 ...
  - 删除不存在的键名，不会报错，返回删除的键数量为 0：

#### 集合的操作
- 添加: SADD 集合名 元素 :SADD fruits "apple"
- 获取: SMEMBERS 集合名 :SMEMBERS fruits
- 检查成员是否存在于集合中: SISMEMBER 集合名 元素 :SISMEMBER fruits "apple"
- 从集合中移除成员：SREM 集合名 元素 :SREM fruits "apple"
- 获取集合中的成员数量：SCARD 集合名 :SCARD fruits
- 获取随机成员：SRANDMEMBER 集合名 [count] :SRANDMEMBER fruits 2
- 求多个集合的并集：SUNION 集合名1 集合名2 ... :SUNION set1 set2 set3
- 求多个集合的交集：SINTER 集合名1 集合名2... :SINTER set1 set2 set3
- 求多个集合的差集：SDIFF 集合名1 集合名2... :SDIFF set1 set2 set3

#### 哈希表操作
- 设置哈希表中的字段值：HSET 哈希表名 字段名 字段值 :HSET obj name "John"
- 获取哈希表中的字段值：HGET 哈希表名 字段名 :HGET obj name
- 一次设置多个字段的值：HMSET 哈希表名 字段名1 字段值1 字段名2 字段值2... :HMSET obj age 25 gender "male"
- 获取多个字段的值：HMGET 哈希表名 字段名1 字段名2... :HMGET obj name age gender
- 获取哈希表中的所有字段和值：HGETALL 哈希表名 :HGETALL obj
- 删除哈希表中的字段: HDEL 哈希表名 字段名1 字段名2 :HDEL obj name age
- 检查哈希表中是否存在指定字段：HEXISTS 哈希表名 字段名 :HEXISTS obj name
- 获取哈希表中所有的字段：HKEYS 哈希表名 :HKEYS obj
- 获取哈希表中所有的值：HVALS 哈希表名 :HVALS obj
- 获取哈希表中字段的数量：HLEN 哈希表名 :HLEN obj

#### 列表操作
##### 添加:
- 将一个或多个元素从列表的左侧插入，即将元素依次插入列表的头部。如果列表不存在，则在执行操作前会自动创建一个新的列表:
  - LPUSH key element1 [element2]...
- 将一个或多个元素从列表的右侧插入，即将元素依次插入列表的尾部。如果列表不存在，则在执行操作前会自动创建一个新的列表:
  - RPUSH key element1 [element2]...
##### 获取:
- LINDEX key index  // 获取列表中指定索引位置的元素
- LRANGE key start stop  // 获取列表中指定范围内的元素
##### 修改:
- LSET key index value  // 将列表中指定索引位置的元素设置为新的值
##### 删除:
- LPOP key  // 从列表的左侧弹出一个元素，并返回该元素的值
- RPOP key  // 从列表的右侧移除并返回最后一个元素
- LREM key count value  // 从列表中删除指定数量的指定值元素
##### 获取列表长度：
- LLEN key

### 发布订阅
- 在Redis中，发布-订阅模式通过以下命令进行操作：
  - PUBLISH命令：用于将消息发布到指定的频道。语法为：PUBLISH channel message。例如，PUBLISH news "Hello, world!" 将消息"Hello, world!"发布到名为"news"的频道。
  - SUBSCRIBE命令：用于订阅一个或多个频道。语法为：SUBSCRIBE channel [channel ...]。例如，SUBSCRIBE news sports 订阅了名为"news"和"sports"的频道。
  - UNSUBSCRIBE命令：用于取消订阅一个或多个频道。语法为：UNSUBSCRIBE [channel [channel ...]]。例如，UNSUBSCRIBE news 取消订阅名为"news"的频道。
  - PSUBSCRIBE命令：用于模式订阅一个或多个匹配的频道。语法为：PSUBSCRIBE pattern [pattern ...]。其中，pattern可以包含通配符。例如，PSUBSCRIBE news.* 订阅了以"news."**开头的所有频道。**
  - PUNSUBSCRIBE命令：用于取消模式订阅一个或多个匹配的频道。语法为：PUNSUBSCRIBE [pattern [pattern ...]]。例如，PUNSUBSCRIBE news.* 取消订阅以"news."开头的所有频道。
### 事务
- Redis支持事务（Transaction），它允许用户将多个命令打包在一起作为一个单元进行执行。事务提供了一种原子性操作的机制，要么所有的命令都执行成功，要么所有的命令都不执行。
- Redis的事务使用MULTI、EXEC、WATCH和DISCARD等命令来管理。
  - MULTI命令：用于开启一个事务。在执行MULTI命令后，Redis会将接下来的命令都添加到事务队列中，而不是立即执行。
  - EXEC命令：用于执行事务中的所有命令。当执行EXEC命令时，Redis会按照事务队列中的顺序执行所有的命令。执行结果以数组的形式返回给客户端。
  - WATCH命令：用于对一个或多个键进行监视。如果在事务执行之前，被监视的键被修改了，事务将被中断，不会执行。
  - DISCARD命令：用于取消事务。当执行DISCARD命令时，所有在事务队列中的命令都会被清空，事务被取消。

#### 使用事务的基本流程
1. 使用MULTI命令开启一个事务。
2. 将需要执行的命令添加到事务队列中。
3. 如果需要，使用WATCH命令监视键。
4. 执行EXEC命令执行事务。Redis会按照队列中的顺序执行命令，并返回执行结果。
5. 根据返回结果判断事务执行是否成功。
```shell

<!-- 开启事务 -->
MULTI
<!-- 添加命令到事务队列 -->
SET key1 value1
GET key2
<!-- 执行事务 -->
EXEC
```
- 事务中的命令在执行之前不会立即执行，而是在执行EXEC命令时才会被执行。这意味着事务期间的命令并不会阻塞其他客户端的操作，也不会中断其他客户端对键的读写操作。
- 需要注意的是，Redis的事务**不支持回滚操作**。如果在事务执行期间发生错误，事务会继续执行，而不会回滚已执行的命令。因此，在使用Redis事务时，需要保证事务中的命令是幂等的，**即多次执行命令的结果和一次执行的结果相同**

### 持久化
- Redis提供两种持久化方式：

####  RDB（Redis Database）持久化：
  - RDB是一种快照的形式，它会将内存中的数据定期保存到磁盘上。可以通过配置Redis服务器，设置自动触发RDB快照的条件，比如在指定的时间间隔内，或者在指定的写操作次数达到一定阈值时进行快照保存。RDB持久化生成的快照文件是一个二进制文件，包含了Redis数据的完整状态。在恢复数据时，可以通过加载快照文件将数据重新加载到内存中。
##### 使用
  - 在redis.conf配置文件中找到save添加以下配置：
    - save 3600 1  300 100 60 10000
      - 3600秒内也就是一小时进行一次改动就会触发快照
      - 300秒内也就是5分钟，进行100次修改就会进行快照
      - 60秒内一万次修改就会进行快照
    - save 900 1  // 在900秒内至少有1个键被修改，则触发快照保存
    - save 300 10  // 在300秒内至少有10个键被修改，则触发快照保存
  - 也可以通过save命令手动触发快照
#### AOF（Append-Only File）持久化：
  - AOF持久化记录了Redis服务器执行的所有写操作命令，在文件中以追加的方式保存。当Redis需要重启时，可以重新执行AOF文件中保存的命令，以重新构建数据集。相比于RDB持久化，AOF持久化提供了更好的数据恢复保证，因为它记录了每个写操作，而不是快照的形式。然而，AOF文件相对于RDB文件更大，恢复数据的速度可能会比较慢。
##### 使用
  - 在redis.conf配置文件中找到appendonly添加以下配置：
    - appendonly yes  // 开启aof持久化
### 主从复制
- Redis主从复制是一种数据复制和同步机制，其中一个Redis服务器（称为主服务器）将其数据复制到一个或多个其他Redis服务器（称为从服务器）。主从复制提供了数据冗余备份、读写分离和故障恢复等功能。
#### 主从复制的一般工作流程
1. 配置主服务器：在主服务器上，你需要在配置文件中启用主从复制并指定从服务器的IP地址和端口号。你可以使用replicaof配置选项或slaveof配置选项来指定从服务器。
2. 连接从服务器：从服务器连接到主服务器并发送复制请求。从服务器通过发送SYNC命令请求进行全量复制或通过发送PSYNC命令请求进行部分复制（增量复制）。
     - 全量复制（SYNC）：如果从服务器是第一次连接或无法执行部分复制，主服务器将执行全量复制。在全量复制期间，主服务器将快照文件（RDB文件）发送给从服务器，从服务器将接收并加载该文件以完全复制主服务器的数据。
     - 部分复制（PSYNC）：如果从服务器已经执行过全量复制并建立了复制断点，主服务器将执行部分复制。在部分复制期间，主服务器将发送增量复制流（replication stream）给从服务器，从服务器将接收并应用该流以保持与主服务器的同步。
3. 复制持久化：从服务器接收到数据后，会将其保存在本地磁盘上，以便在重启后仍然保持数据的一致性。
4. 同步延迟：从服务器的复制是异步的，因此存在复制延迟。延迟取决于网络延迟、主服务器的负载和从服务器的性能等因素。
5. 读写分离：一旦建立了主从复制关系，从服务器可以接收读操作。这使得可以将读流量从主服务器分散到从服务器上，从而减轻主服务器的负载。
6. 故障恢复：如果主服务器发生故障，可以将一个从服务器提升为新的主服务器，以继续提供服务。当主服务器恢复时，它可以作为从服务器连接到新的主服务器，继续进行数据复制。

##### 配置
- 在根目录下面新建一个 从服务器配置文件，比如redis-6378.conf 配置文件 作为redis从服务器,默认的配置文件6379作为主服务器

- redis-6378.conf 文件配置
- ```shell
  bind 127.0.0.1 #ip地址
  port 6378 #端口号
  daemonize yes #守护线程静默运行
  replicaof 127.0.0.1 6379 #指定主服务器
  ```
- 启动从服务器
  - ```shell
  redis-server redis-6378.conf
  ```
- 打开从服务器cli
- ```shell
  redis-cli -p 6378
  ```
- 启动主服务器
- ```shell
  redis-server #直接启动默认就是主服务器的配置文件
  ```
- 这个时候主服务器写入一个值，从服务器直接同步过来这个值 就可以直接获取到，从服务器是不允许写入操作的

### ioredis 
- 是一个强大且流行的 Node.js 库，用于与 Redis 进行交互。Redis 是一个开源的内存数据结构存储系统。ioredis 提供了一个简单高效的 API，供 Node.js 应用程序与 Redis 服务器进行通信。
- 以下是 ioredis 的一些主要特点：
  - 高性能：ioredis 设计为快速高效。它支持管道操作，可以在一次往返中发送多个 Redis 命令，从而减少网络延迟。它还支持连接池，并且可以在连接丢失时自动重新连接到 Redis 服务器。
  - Promises 和 async/await 支持：ioredis 使用 promises，并支持 async/await 语法，使得编写异步代码和处理 Redis 命令更加可读。
  - 集群和 sentinel 支持：ioredis 内置支持 Redis 集群和 Redis Sentinel，这是 Redis 的高级功能，用于分布式设置和高可用性。它提供了直观的 API，用于处理 Redis 集群和故障转移场景。
  - Lua 脚本：ioredis 允许你使用 eval 和 evalsha 命令在 Redis 服务器上执行 Lua 脚本。这个功能使得你可以在服务器端执行复杂操作，减少客户端与服务器之间的往返次数。
  - 发布/订阅和阻塞命令：ioredis 支持 Redis 的发布/订阅机制，允许你创建实时消息系统和事件驱动架构。它还提供了对 BRPOP 和 BLPOP 等阻塞命令的支持，允许你等待项目被推送到列表中并原子地弹出它们。
  - 流和管道：ioredis 支持 Redis 的流数据类型，允许你消费和生成数据流。它还提供了一种方便的方式将多个命令进行管道化，减少与服务器之间的往返次数。

## lua
- Lua是一种轻量级、高效、可嵌入的脚本语言，最初由巴西里约热内卢天主教大学（Pontifical Catholic University of Rio de Janeiro）的一个小团队开发而成。它的名字"Lua"在葡萄牙语中意为"月亮"，寓意着Lua作为一门明亮的语言。
- Lua具有简洁的语法和灵活的语义，被广泛应用于嵌入式系统、游戏开发、Web应用、脚本编写等领域。它的设计目标之一是作为扩展和嵌入式脚本语言，可以与其他编程语言无缝集成。Lua的核心只有很小的代码库，但通过使用模块和库可以轻松地扩展其功能。
- 以下是一些关键特点和用途介绍：

  - 简洁高效：Lua的语法简单清晰，语义灵活高效。它使用动态类型和自动内存管理，支持面向过程和函数式编程风格，并提供了强大的协程支持。
  - 嵌入式脚本语言：Lua被设计为一种可嵌入的脚本语言，可以轻松地与其他编程语言集成。它提供了C API，允许开发者将Lua嵌入到C/C++程序中，或者通过扩展库将Lua嵌入到其他应用程序中。
  - 游戏开发：Lua在游戏开发中广泛应用。许多游戏引擎（如Unity和Corona SDK）都支持Lua作为脚本语言，开发者可以使用Lua编写游戏逻辑、场景管理和AI等。
  - 脚本编写：由于其简洁性和易学性，Lua经常被用作脚本编写语言。它可以用于编写各种系统工具、自动化任务和快速原型开发。
  - 配置文件：Lua的语法非常适合用作配置文件的格式。许多应用程序和框架使用Lua作为配置文件语言，因为它易于阅读、编写和修改。

- 为了增强性能和扩展性，可以将Lua与Redis和Nginx结合使用。这种组合可以用于构建高性能的Web应用程序或API服务。
  - Redis：Redis是一个快速、高效的内存数据存储系统，它支持各种数据结构，如字符串、哈希、列表、集合和有序集合。与Lua结合使用，可以利用Redis的高速缓存功能和Lua的灵活性来处理一些复杂的计算或数据查询。
    - 缓存数据：使用Redis作为缓存存储，可以将频繁访问的数据存储在Redis中，以减轻后端数据库的负载。Lua可以编写与Redis交互的脚本，通过读取和写入Redis数据来提高数据访问速度。
    - 分布式锁：通过Redis的原子性操作和Lua的脚本编写能力，可以实现分布式锁机制，用于解决并发访问和资源竞争的问题。
  - Nginx：Nginx是一个高性能的Web服务器和反向代理服务器。它支持使用Lua嵌入式模块来扩展其功能。
    - 请求处理：使用Nginx的Lua模块，可以编写Lua脚本来处理HTTP请求。这使得可以在请求到达应用程序服务器之前进行一些预处理、身份验证、请求路由等操作，从而减轻后端服务器的负载。
    - 动态响应：通过结合Lua和Nginx的subrequest机制，可以实现动态生成响应。这对于根据请求参数或其他条件生成动态内容非常有用。
    - 访问控制：使用Lua脚本，可以在Nginx层面对访问进行细粒度的控制，例如IP白名单、黑名单、请求频率限制等。
### 安装
- https://luabinaries.sourceforge.net/download.html
### 插件
- lua、lua Debug
### 基本语法
#### 变量
- 全局变量
  - 全局变量是在全局作用域中定义的变量，可以在脚本的任何地方访问。
  - 全局变量在定义时不需要使用关键字，直接赋值即可。
    ```lua
    test = '123'
    print(test)
    ```
- 局部变量
  - 局部变量是在特定作用域内定义的变量，只能在其所属的作用域内部访问。
  - 局部变量的作用域通常是函数体内部，也可以在代码块（使用 do...end）中创建局部变量。
  - 在局部作用域中，可以通过简单的赋值语句定义局部变量。
  ```lua
  --local 定义局部变量
  local test = '123'
  print(test)
  ```
#### 数据类型
1. nil：表示无效值或缺失值。
2. boolean：表示布尔值，可以是 true 或 false。
3. number：表示数字，包括整数和浮点数。
4. string：表示字符串，由字符序列组成。
5. table：表示表，一种关联数组，用于存储和组织数据。
6. function：表示函数，用于封装可执行的代码块。
7. userdata：表示用户自定义数据类型，通常与C语言库交互使用。
8. thread：表示协程，用于实现多线程编程。
9. metatable：表示元表，用于定义表的行为。
##### 常用数据类型用法
```lua
type = false --布尔值
type = nil --就是null
type = 1 --整数
type = 1.1 --浮点型
type = 'test' --字符串
print(type)
```
##### 字符串拼接 ..
```lua
local a = 'a'
local b = 'b'
print(a .. b)
```
##### table 可以描述 对象和数组
- lua索引从1开始
```lua
--对象
table = {
    name = "zhangsan",
    age = 18
}
print(table.name)
print(table.age)
--数组
arr = {1,2,3,4,6}
print(arr[1])
```
#### 条件语句
- 在Lua中，条件判断语句可以使用 if、elseif 和 else 关键字来实现
  ```lua
  local test = '123'
  if test == '123' then
    print('123')
  elseif test == '456' then
    print('456')
  else
    print('789')
  end
  ```
#### 循环
```lua
for i = 1, 10, 3 do --开始 结束 步长  步长就是递增数量
    print(i)
end
```
##### 循环table
```lua
arr = {name = "hello", age = 18, sex = "male"}
for k, v in pairs(arr) do
    print(k, v)  --key 和 value 也就是 name 和 hello ...
end
```
##### 循环数组
```lua
local arr = {10,20,30}

for i, v in ipairs(arr) do
    print(i,v)
end
```
#### 函数
- 在Lua中，函数是一种可重复使用的代码块，用于执行特定的任务或操作
```lua
local name = 'tuji'

function func(name)
    if name == "tuji" then
        print("tuji")
        return 1
    elseif name == "xhh" then
        print("xhh")
        return 2
    else
        print("not name")
        return 3
    end
end

local result = func(name)
print(result)
```
#### 模块化
- test.lua 暴露一个方法add
```lua
local M = {}

function M.add(a, b)
    return a + b
end

return M
```
- index.lua 引入该文件调用add方法
```lua
local math = require('test')

local r = math.add(1, 2)

print(r)
```
## 定时任务cron
- 依赖：node-schedule
- 一般定时任务都是用cron表达式去表示时间的
### cron表达式
- Cron表达式是一种用于指定定时任务执行时间的字符串表示形式。它由6个或7个字段组成，每个字段表示任务执行的时间单位和范围。

- Cron表达式的典型格式如下：
  ```
  *    *    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬      ┬
│    │    │    │    │    │      └── 年份（可选，其他都是必选）；取值范围：1970+；特殊字符：- * /
│    │    │    │    │    └── 星期（0 - 6，0表示星期日）；[1, 7]或[MON, SUN]。若使用[1, 7]表达方式，1代表星期一，7代表星期日；* , - / ? L #
│    │    │    │    └───── 月份（1 - 12）；[1, 12]或[JAN, DEC]；* , - /
│    │    │    └────────── 日（1 - 31）；	* , - / ? L W
│    │    └─────────────── 小时（0 - 23）；* , - /
│    └──────────────────── 分钟（0 - 59）；* , - /
└───────────────────────── 秒（0 - 59）；* , - /
  ```
- 每个字段可以接受特定的数值、范围、通配符和特殊字符来指定任务的执行时间：
  - 数值：表示具体的时间单位，如1、2、10等。
  - 范围：使用-连接起始和结束的数值，表示一个范围内的所有值，如1-5表示1到5的所有数值。
  - 通配符：使用*表示匹配该字段的所有可能值，如*表示每分钟、每小时、每天等。
  - 逗号分隔：使用逗号分隔多个数值或范围，表示匹配其中任意一个值，如1,3表示1或3。
  - 步长：使用/表示步长，用于指定间隔的数值，如*/5表示每隔5个单位执行一次。
  - 特殊字符：Cron表达式还支持一些特殊字符来表示特定的含义，如?用于替代日和星期字段中的任意值，L表示最后一天，W表示最近的工作日等。

- 以下是一些常见的Cron表达式示例：
  - * * * * * *：每秒执行一次任务。
  - 0 * * * * *：每分钟的整点执行一次任务。
  - 0 0 * * * *：每小时的整点执行一次任务。
  - 0 0 * * 1 *：每周一的午夜执行一次任务。
  - 0 0 1 * * *：每月的1号午夜执行一次任务。
  - 0 0 1 1 * *：每年的1月1日午夜执行一次任务。
```js
import schedule from 'node-schedule'
schedule.scheduleJob('0 30 0 * * *', () => {
    //定时任务
})
```
## http缓存
- HTTP 缓存主要分为两大类：强缓存和协商缓存。这两种缓存都通过 HTTP 响应头来控制，目的是提高网站性能。
### 强缓存
- 强缓存之后则不需要向服务器发送请求，而是从浏览器缓存读取分为（内存缓存）| （硬盘缓存）
  1. memory cache(内存缓存) 内存缓存存储在浏览器内存当中，一般刷新网页的时候会发现很多内存缓存
  2. disk cache(硬盘缓存) 硬盘缓存是存储在计算机硬盘中，空间大，但是读取效率比内存缓存慢
#### Expires
- 该字段指定响应的到期时间，即资源不再被视为有效的日期和时间。它是一个 HTTP 1.0 的头部字段，但仍然被一些客户端和服务器使用。
- 判断机制：当客户端请求资源时，会获取本地时间戳，然后拿本地时间戳与 Expires 设置的时间做对比，如果对比成功，走强缓存，对比失败，则对服务器发起请求获取新值。
#### Cache-Control
- Cache-Control 的值如下：
  1. max-age：浏览器资源缓存的时长(秒)。
  2. no-cache：不走强缓存，走协商缓存。
  3. no-store：禁止任何缓存策略。
  4. public：资源即可以被浏览器缓存也可以被代理服务器缓存(CDN)。
  5. private：资源只能被客户端缓存。
- 如果 max-age 和 Expires 同时出现 max-age 优先级高
### 协商缓存
- 当涉及到缓存机制时，强缓存优先于协商缓存。当资源的强缓存生效时，客户端可以直接从本地缓存中获取资源，而无需与服务器进行通信。强缓存的判断是通过缓存头部字段来完成的，例如设置了合适的Cache-Control和Expires字段
- 如果强缓存未命中（例如max-age过期），或者服务器响应中设置了Cache-Control: no-cache，则客户端会发起协商缓存的请求。在协商缓存中，客户端会发送带有缓存数据标识的请求头部字段，以向服务器验证资源的有效性。
- 服务器会根据客户端发送的协商缓存字段（如If-Modified-Since和If-None-Match）来判断资源是否发生变化。如果资源未发生修改，服务器会返回状态码 304（Not Modified），通知客户端可以使用缓存的版本。如果资源已经发生变化，服务器将返回最新的资源，状态码为 200。
#### Last-Modified
- Last-Modified 和 If-Modified-Since：服务器通过 Last-Modified 响应头告知客户端资源的最后修改时间。客户端在后续请求中通过 If-Modified-Since 请求头携带该时间，服务器判断资源是否有更新。如果没有更新，返回 304 状态码。
#### ETag
- ETag 和 If-None-Match：服务器通过 ETag 响应头给资源生成一个唯一标识符。客户端在后续请求中通过 If-None-Match 请求头携带该标识符，服务器根据标识符判断资源是否有更新。如果没有更新，返回 304 状态码。
- ETag 优先级比 Last-Modified 高

## http2
- HTTP/2（HTTP2）是超文本传输协议（HTTP）的下一个主要版本，它是对 HTTP/1.1 协议的重大改进。HTTP/2 的目标是改善性能、效率和安全性，以提供更快、更高效的网络通信
- HTTP/2 的主要改进包括：
1. 多路复用（Multiplexing）：HTTP/2 支持在单个 TCP 连接上同时发送多个请求和响应。这意味着可以避免建立多个连接，减少网络延迟，提高效率。
2. 二进制分帧（Binary Framing）：在应用层（HTTP2）和传输层（TCP or UDP）之间增加了二进制分帧层，将请求和响应拆分为多个帧（frames）。这种二进制格式的设计使得协议更加高效，并且容易解析和处理。
  - 帧：最小的通信单位，承载特定类型的数据，比如HTTP首部、负荷
  - HTTP/2 帧类型：
    1. 数据帧（Data Frame）：用于传输请求和响应的实际数据。
    2. 头部帧（Headers Frame）：包含请求或响应的头部信息。
    3. 优先级帧（Priority Frame）：用于指定请求的优先级。
    4. 设置帧（Settings Frame）：用于传输通信参数的设置。
    5. 推送帧（Push Promise Frame）：用于服务器主动推送资源。
    6. PING 帧（PING Frame）：用于检测连接的活跃性。
    7. 重置帧（RST_STREAM Frame）：用于重置数据流或通知错误。
3. 头部压缩（Header Compression）：HTTP/2 使用首部表（Header Table）和动态压缩算法来减少头部的大小。这减少了每个请求和响应的开销，提高了传输效率。
- 使用https实现http2
  - 使用openssl 生成 tls证书
    - 生成私钥：openssl genrsa -out server.key 1024
    - 生成证书请求文件：openssl req -new -key server.key -out server.csr
    - 生成证书：openssl x509 -req -in server.csr -out server.crt -signkey server.key -days 3650
## 短链接
- 短链接是一种缩短长网址的方法，将原始的长网址转换为更短的形式。它通常由一系列的字母、数字和特殊字符组成，比起原始的长网址，短链接更加简洁、易于记忆和分享。
- 短链接的主要用途之一是在社交媒体平台进行链接分享。由于这些平台对字符数量有限制，长网址可能会占用大量的空间，因此使用短链接可以节省字符数，并且更方便在推特、短信等限制字数的场景下使用。
- 另外，短链接还可以用于跟踪和统计链接的点击量。通过在短链接中嵌入跟踪代码，网站管理员可以获得关于点击链接的详细统计数据，包括访问量、来源、地理位置等信息。这对于营销活动、广告推广或分析链接的效果非常有用。
- 实现原理大致就是生成一个唯一的短码，利用重定向，定到原来的长连接地址。
- shortid库生成短码
## 串口通信
- 串口技术是一种用于在计算机和外部设备之间进行数据传输的通信技术。它通过串行传输方式将数据逐位地发送和接收。
- 常见的串口设备有，扫描仪，打印机，传感器，控制器，采集器，电子秤等
- SerialPort
  - 一个流行的 Node.js 模块，用于在计算机中通过串口与外部设备进行通信。它提供了一组功能强大的 API，用于打开、读取、写入和关闭串口连接，并支持多种操作系统和串口设备。
- SerialPort 模块的主要功能包括：
  1. 打开串口连接：使用 SerialPort 模块，可以轻松打开串口连接，并指定串口名称、波特率、数据位、停止位、校验位等参数
  2. 读取和写入数据：通过 SerialPort 模块，可以从串口读取数据流，并将数据流写入串口。可以使用事件处理程序或回调函数来处理读取和写入操作。
  3. 配置串口参数：SerialPort 支持配置串口的各种参数，如波特率、数据位、停止位、校验位等。可以根据需求进行定制。
  4. 控制流控制：SerialPort 允许在串口通信中应用硬件流控制或软件流控制，以控制数据的传输速率和流程。
  5. 事件处理：SerialPort 模块可以监听串口连接的各种事件，如打开、关闭、错误等，以便及时处理和响应。
## SSO单点登录
- 单点登录（Single Sign-On，简称SSO）是一种身份认证和访问控制的机制，允许用户使用一组凭据（如用户名和密码）登录到多个应用程序或系统，而无需为每个应用程序单独提供凭据
- SSO的主要优点包括：
  1. 用户友好性：用户只需登录一次，即可访问多个应用程序，提供了更好的用户体验和便利性。
  2. 提高安全性：通过集中的身份验证，可以减少密码泄露和密码管理问题。此外，SSO还可以与其他身份验证机制（如多因素身份验证）结合使用，提供更强的安全性。
  3. 简化管理：SSO可以减少管理员的工作量，因为他们不需要为每个应用程序单独管理用户凭据和权限。
- 例
  - xx科技，xx教育，都是xx旗下的公司，那么我需要给每套系统做一套登录注册，人员管理吗，那太费劲了，于是使用SSO单点登录，只需要在任意一个应用登录过，其他应用便是免登录的一个效果，如果过期了，在重新登录。
  - 但是每个应用是不同的，登录用的是一套，这时候可以模仿一下微信小程序的生成一个AppId作为应用ID，并且还可以创建一个secret，因为每个应用的权限可以不一样，所以最后生成的token也不一样，还需要一个url，登录之后重定向到该应用的地址，正规做法需要有一个后台管理系统用来控制这些，注册应用，删除应用。
- 实现思路
  - 通过appId访问子应用时，会判断有无token，没有则重定向到登录页面，登录成功后，会重定向到子应用，并且会携带token。
  - 登录成功后appid会和应用地址、secret、token、应用名称等生成一个映射，比如通过session标识用户登录过
  - 用户在登录其他应用时，会判断session标识，如果存在则直接跳转（如果存过token就直接取 没有存过就生成一个），不存在则重定向到登录页面。

## SDL单设备登录
- SDL（Single Device Login）是一种单设备登录的机制，它允许用户在同一时间只能在一个设备上登录，当用户在其他设备上登录时，之前登录的设备会被挤下线。
- 应用场景
  1. 视频影音，防止一个账号共享，防止一些账号贩子
  2. 社交媒体平台：社交媒体平台通常有多种安全措施来保护用户账户，其中之一就是单设备登录。这样可以防止他人在未经授权的情况下访问用户的账户，并保护用户的个人信息和隐私
  3. 对于在线购物和电子支付平台，用户的支付信息和订单详情是敏感的。通过单设备登录，可以在用户进行支付操作时增加额外的安全层级，确保只有授权设备可以进行支付操作
  4. 对于电子邮箱和通讯应用，用户的个人和机密信息都存储在其中。通过单设备登录机制，可以确保用户的电子邮箱或通讯应用只能在一个设备上登录，避免账户被他人恶意使用
- 实现思路
  - 第一次登录的时候记录用户id，并且记录socket信息，和浏览器指纹
  - 当有别的设备登录的时候发现之前已经连接过了，便使用旧的socket发送下线通知，并且关闭旧的socket，更新socket替换成当前新设备的ws连接
  - 浏览器指纹
    - 指纹技术有很多种，这里采用canvas指纹技术
    - 网站将这些颜色数值传递给一个算法，算法会对这些数据进行复杂的计算，生成一个唯一的标识。由于用户使用的操作系统、浏览器、GPU、驱动程序会有差异，在绘制图形的时候会产生差异，这些细微的差异也就导致了生成的标识（哈希值）不一样。因此，每一个用户都可以生成一个唯一的Canvas指纹
## SCL扫码登录
- SCL (Scan Code Login) 是一种扫码登录的技术，它允许用户通过扫描二维码来进行登录操作。这种登录方式在许多应用和网站中得到广泛应用，因为它简单、方便且安全。
- SCL 扫码登录的优点包括：
  1. 方便快捷：用户只需打开扫码应用程序并扫描二维码即可完成登录，无需手动输入用户名和密码。
  2. 安全性高：扫码登录采用了加密技术，用户的登录信息在传输过程中得到保护，降低了密码被盗取或泄露的风险。
  3. 避免键盘记录：由于用户无需在登录过程中输入敏感信息，如用户名和密码，因此不会受到键盘记录软件的威胁。
  4. 适用性广泛：SCL 扫码登录可以与不同的应用和网站集成，提供统一的登录方式，使用户无需记住多个账户的用户名和密码。
- 实现思路
  1. 需要一个页面调用接口获取qrcode也就是二维码去展示，然后顺便展示一下状态，默认0 未授权
  2. 在这个页面轮询接口检查状态是否是已授权，如果是已授权或者超时就停止轮询。
  3. 扫码之后会打开授权页面，在授权页面点击确认按钮进行授权分配token
## 杀毒-clamav
- 杀毒（Antivirus）是指一类计算机安全软件，旨在检测、阻止和清除计算机系统中的恶意软件，如病毒、蠕虫、木马、间谍软件和广告软件等。这些恶意软件可能会对计算机系统和用户数据造成损害，包括数据丢失、系统崩溃、个人信息泄露等。
- 杀毒软件通过使用各种技术来保护计算机免受恶意软件的威胁
- 应用场景
  1. 杀毒软件编写
  2. 日常杀毒使用
  3. 实时保护
  4. 邮件web扫描
  5. 服务器杀毒
### 引擎
- ClamAV（Clam AntiVirus）是一个开源的跨平台杀毒软件，它专注于检测和清除恶意软件，包括病毒、蠕虫、木马、恶意软件和其他恶意代码。
- 以下是ClamAV的一些特点和功能：
  1. 开源和免费：ClamAV是一个自由开源的杀毒软件，可以在各种操作系统上免费使用，包括Windows、macOS和Linux等。
  2. 多平台支持：ClamAV是跨平台的，可以在多种操作系统上运行，包括Windows、macOS、Linux、FreeBSD等。
  3. 病毒扫描引擎：ClamAV使用强大的病毒扫描引擎来检测和识别各种恶意软件。它可以扫描文件、文件夹和压缩文件等，以查找潜在的威胁。
  4. 多种扫描模式：ClamAV提供不同的扫描模式，包括快速扫描、全盘扫描和定制扫描。用户可以根据需要选择适当的扫描模式。
  5. 实时保护：ClamAV可以提供实时监控和保护功能，可以在文件被访问、下载或执行时即时检测和阻止潜在的恶意软件。
  6. 病毒定义更新：ClamAV定期发布病毒定义数据库的更新，以保持对新出现的病毒和恶意软件变种的识别能力。用户可以手动或自动更新病毒定义文件。
  7. 命令行工具和图形界面：ClamAV提供了命令行工具和图形界面，使用户可以方便地执行扫描、更新和配置等操作。
### 下载安装
- www.clamav.net/downloads
- 配置系统环境变量
- 安装完成之后目录会有一个 conf_examples 文件夹 它自带的
  - clamd.conf.sample
  - freshclam.conf.sample
  - 我们需要将这俩个文件移动到clamav安装根目录下然后把.sample后缀去掉
  - 然后将这俩个文件里不带注释的Example注释掉
  - 然后执行命令更新病毒库：freshclam
  - 然后执行命令启动服务：clamd
## OSS
- OSS（Object Storage Service）是一种云存储服务，提供了一种高度可扩展的、安全可靠的对象存储解决方案
- OSS 对象存储以对象为基本存储单元，每个对象都有唯一的标识符（称为对象键）和数据。这些对象可以是任意类型的文件，如文档、图片、视频等。OSS 提供了高可用性、高扩展性和高安全性的存储服务，适用于各种应用场景，包括数据备份与归档、静态网站托管、大规模数据处理、移动应用程序存储等。
## rabbitmq
- RabbitMQ是一个开源的，在AMQP基础上完整的，可复用的企业消息系统。
  - AMQP(高级消息队列协议) 实现了对于消息的排序，点对点通讯，和发布订阅，保持可靠性、保证安全性。
- 支持主流的操作系统，Linux、Windows、MacOS等
- 多种开发语言支持，Java、Python、Ruby、.NET、PHP、C/C++、javaScript等
### RabbitMQ核心概念
1. 消息：在RabbitMQ中，消息是传递的基本单元。它由消息体和可选的属性组成
2. 生产者Producer：生产者是消息的发送方，它将消息发送到RabbitMQ的交换器（Exchange）中
3. 交换器Exchange：交换器接收从生产者发送的消息，并根据特定的规则将消息路由到一个或多个队列中
4. 队列Queue：队列是消息的接收方，它存储了待处理的消息。消费者可以从队列中获取消息并进行处理
5. 消费者Consumer：消费者是消息的接收方，它从队列中获取消息并进行处理
- https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71ad107b341142289d216f447b588ebc~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1727&h=500&s=470698&e=png&b=fffdfd
### 安装
1. 安装Rabbit MQ的依赖环境erlang
  - MQ是基于这个语言开发的
  - www.erlang.org/downloads
  - 安装完成之后 新增一个环境变量
    - ERLANG_HOME -> 对应的目录例如(D:\erlang\Erlang OTP)
    - 然后path 新增 %ERLANG_HOME%\bin
  - 打开cdm 输入 erl 没有报错即可成功
2. 安装mq
  - 下载https://www.rabbitmq.com/docs/install-windows
  - 配置环境变量：安装目录/sbin
3. 启动MQ
  - 安装MQ插件拥有可视化面板
    - rabbitmq-plugins enable rabbitmq_management
  - 启动MQ
    - rabbitmq-server.bat start
    - 如果保存端口被占用，则可能是安装完成时勾选了自启动，需要win+r 输入services.msc 找到rabbitmq 停止服务和改为手动启用
  - 访问 http://localhost:15672/#/ 账号密码都是 guest
### 应用场景
1. 微服务之间的通讯，或者跨语言级别通讯
2. 异步任务，比如执行完成一个接口需要发送邮件，我们无需等待邮件发送完成再返回，我们可以直接返回结果，在异步任务中处理邮件。
3. 日志的收集和分发，将应用程序的日志消息发送到 RabbitMQ 队列中，然后使用消费者进行处理和分发。这样可以集中管理和处理日志，提供实时监控和分析
### MQ进阶用法
#### 发布订阅
  - 发布订阅，消息的发送者称为发布者（Publisher），而接收消息的一个或多个实体称为订阅者（Subscriber）
  - 回顾基础用法，点对点通讯生产者发送一条消息通过路由投递到Queue，只有一个消费者能消费到 也就是一对一发送
    - 回归主题 发布订阅就是生产者的消息通过交换机写到多个队列，不同的订阅者消费不同的队列，也就是实现了一对多
  - 发布订阅的模式分为四种
    1. Direct（直连）模式：把消息放到交换机指定key的队列里面。
    2. Topic（主题）模式： 把消息放到交换机指定key的队列里面，额外增加使用"*"匹配一个单词或使用"#"匹配多个单词
    3. Headers（头部）模式：把消息放到交换机头部属性去匹配队列
    4. Fanout（广播）模式：把消息放入交换机所有的队列，实现广播
#### 总结
- 通过使用RabbitMQ作为缓冲，避免数据库服务崩溃的风险。生产者将消息放入队列，消费者从队列中读取消息并进行处理，随后确认消息已被处理。在应用之间存在一对多的关系时，可以使用Exchange交换机根据不同的规则将消息转发到相应的队列：
1. 直连交换机（direct exchange）：根据消息的路由键（routing key）将消息直接转发到特定队列。
2. 主题交换机（topic exchange）：根据消息的路由键进行模糊匹配，将消息转发到符合条件的队列。
3. 头部交换机（headers exchange）：根据消息的头部信息进行转发。
4. 广播交换机（fanout exchange）：将消息广播到交换机下的所有队列
### MQ高级用法
#### 延时消息
  - 什么是延时消息?
    - Producer 将消息发送到 MQ 服务端，但并不期望这条消息立马投递，而是延迟一定时间后才投递到 Consumer 进行消费，该消息即延时消息
  - 插件安装
    - https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases
    - 把下载好的文件拖到rabbitMQ下面的plugins目录里面，如D:\work\rabbitmq\rabbitmq_server-4.1.0\plugins
    - 然后在cmd窗口执行 rabbitmq-plugins enable rabbitmq_delayed_message_exchange
  - 检查是否成功
    - 打开可视化面板，访问 http://localhost:15672/#/ 账号密码都是 guest
    - 在Exchanges下的Add a new exchange中的type选项会多出一个x-delayed-messagee
##### 应用场景
  - 现在是2024-06-06 半夜1.08分，我选择外卖预约中午的11.00 - 11.20 左右的外卖，我如果选择下单，那么这个单不会立马推送到商家的客户端里面，而是存放到消息队列，使用延时消息，在差不多的时间段例如10.30左右才会把这个单推送到商家的客户端，这样商家出餐10分钟，骑手送20-30分钟左右，送过来就差不多11点左右




