$(function () {
    var layer = layui.layer

    //定义查询参数对象，将来查询文章使用
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + "-" + m + "-" + d + '' + hh + ":" + mm + ":" + ss

    }
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,//页码
        pagesize: 2,//每页显示多少条数据
        cate_id: '',//文章的类别Id  
        stata: ''//文章状态，可选值，修改，未修改
    }
    //渲染文章列表
    var layer = layui.layer
    initTable()
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }

        })
    }
    //初始化文章分类
    var form = layui.form;
    initCate()
    function initCate() {

        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    //帅选功能
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        //获取
        var state = $("[name=state]").val()
        var cate_id = $("[name=cate_id]").val()
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable()
    })

    var laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({
            elem: "pageBox",
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            //快捷分页选项
            layout: ['count', ' limit', 'prev', 'page',
                'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }

            }
        })
    }
    var layer = layui.layer
    $("tbody").on("click", '.btn-delete', function () {
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr("data-id");
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('恭喜删除成功')
                    //判断当前页码是否有内容
                    //没有页码减一
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})