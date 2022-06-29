<div align="center">
    <h2>Irene.js</h2>
</div>
<div align=center>
    <img style="border-radius: 4px" src="./irene.png" width="200" title="https://www.bilibili.com/video/BV11Y4y1b781" />
</div>
<div align="right">
    <a href="https://www.bilibili.com/video/BV11Y4y1b781">图片出处</a>
</div>


### Irene.js 是啥？
一个瞎寄吧捣鼓的操作Dom元素框架，然后还夹带了私货（👆

### 有啥用？
很久之前我就有了这样的想法，每当我需要抓取页面的Dom元素进行操作时，不是原生就是JQuery，但是呢，原生啰嗦又麻烦，JQuery多余的功能太多且臃肿，所以就想着做个针对Dom元素操作的框架，进行数据采集或者写些小脚本啥的。

目前处于勉强能用状态。

### 使用教程？

#### 构造方法
```javascript
$irene(HTMLElement | String(idName | className | tagName) | Array);
```

#### forEach、map、filter、sort
```javascript
method: forEach(f) -> void
$irene('p').forEach((item, index) => {
    ...
});

method: map(f) -> Irene
const newP = $irene('p').map((item, index) => {
    ...
});

method: filter(f) -> Irene
const newP = $irene('p').filter((item, index) => {
    ...
});

method: sort(f=(a,b)=>a-b) -> Irene
$irene('p').sort();
```

#### 获取父类Dom
```javascript
method: parent() -> Irene
```

#### 获取同级Dom
```javascript
method: siblings() -> Irene
```

#### 获取子类Dom
```javascript
method: children() -> Irene
```

#### 在当前头部添加元素、在当前尾部添加元素
```javascript
method: begin(elem) -> Irene
method: append(elem) -> Irene
```

#### 在子类头部添加元素、在子类尾部添加元素
```javascript
method: beginChild(elem) -> Irene
method: appendChild(elem) -> Irene
```

#### 删除与渲染
```javascript
method: remove() -> Irene
method: render() -> Irene
```

#### eq、range、first、last
```javascript
method: eq(index) -> Irene
method: range(startIndex, endIndex) -> Irene
method: first() -> Irene
method: last() -> Irene
```

#### text、setText
```javascript
method: text() -> String
method: setText() -> Irene
```

#### clone、clear、getElems、len
```javascript
method: clone(isDeep = true) -> Irene
method: clear() -> void
method: getElems() -> Array
method: len() -> Number
```