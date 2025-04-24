# -*- coding: utf-8 -*-
# python2需要上面的编码声明
# WordCloud：
# WordCloud是一个用于生成词云的Python库。它可以根据给定的文本数据，根据词频生成一个美观的词云图像，其中词语的大小表示其在文本中的重要程度或频率。WordCloud库提供了丰富的配置选项，可以控制词云的外观、颜色、字体等属性。你可以根据需求定制词云的样式和布局。WordCloud还提供了一些方便的方法，用于从文本中提取关键词、过滤停用词等。你可以使用pip安装WordCloud库，并参考官方文档进行使用。
# jieba：
# jieba是一个开源的中文分词库，用于将中文文本切分成单个词语。中文分词是NLP（自然语言处理）中的一个重要任务，jieba库提供了一种有效且灵活的分词算法，可以在中文文本中准确地识别出词语边界。jieba支持三种分词模式：精确模式、全模式和搜索引擎模式。你可以根据需要选择适合的分词模式
import jieba # 中文分词，断句
from wordcloud import WordCloud # 生成词云图数据
import matplotlib.pyplot as plt # 根据词云图数据绘制词云图
import sys # 获取命令行参数
import os # 用于处理文件路径

# 获取外部通过命令行参数传入的文本数据
text=sys.argv[1]
# 中文分词
words=jieba.cut(text)
# 添加字体文件以支持中文
# 使用绝对路径指定字体文件
current_dir = os.path.dirname(os.path.abspath(__file__))
font_path = os.path.abspath(os.path.join(current_dir, '../../../public/font/youshebiaotihei.ttf'))

# 确保字体文件存在
if not os.path.exists(font_path):
    print(f"字体文件不存在: {font_path}")
    # 使用系统默认字体
    font_path = None
    print("将使用系统默认字体")
# 生成词云图数据
w=WordCloud(font_path=font_path,width=1000,height=700,background_color='white').generate(' '.join(words))
# 绘制词云图
# 将 WordCloud 生成的词云数据转换为图像形式,interpolation='bilinear' 使图像边缘更平滑（避免像素锯齿）
plt.imshow(w,interpolation='bilinear')
# 关闭坐标轴和边框的显示,让词云图以“干净”的纯图像形式呈现（无干扰元素）
plt.axis('off')
# 触发图像渲染并弹出显示窗口
plt.show()