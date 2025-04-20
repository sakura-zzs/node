-- Keys和ARGV是redis支持通过eval命令传递给lua脚本的参数，只有redis执行eval命令时才会传递这两个参数
local key = KEYS[1]
-- tonumber就是将字符串转换为数字类型
local limit = tonumber(ARGV[1])
local internal = tonumber(ARGV[2])
-- 获取存的点击次数
local count=tonumber(redis.call('get',key) or '0')
-- redis.call 就是调用redis的命令，它也是redis执行lua脚本才会有的函数
-- incr 就是递增值
-- expire 就是存储过期时间
-- 大致思路就是先读取值如果值存在并且超过限流阀则返回0表示操作频繁，否则点击一次累加一次
-- internal内超过了limit次就返回0表示操作频繁
if count > limit then
    return 1
else
  -- 点击一次就累加一次
    redis.call('incr', key)
    -- internal自动过期，再次触发lua脚本就会重新计算
    redis.call('expire',key,internal)
    return 0
end