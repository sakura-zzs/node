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

