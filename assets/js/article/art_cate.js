$(function () {
    //获取文章分类列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    $("#btnAddCate").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })
    //提交添加文章分类
    //弹出层是后添加的，父盒子是body
    var layer = layui.layer
    var indexAdd = null
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.massage)
                }
                initArtCateList()
                layer.msg('恭喜您添加成功');
                layer.close(indexAdd);
            }
        })

    })
    //修改form表单
    var indexEdit = null
    var form = layui.form
    $("tbody").on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        })
        // alert($(this).attr('data-id'))
        var Id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)

                }
                form.val('form-edit', res.data)
            }
        })
    })
    //通过代理形式修改表单submit事件
    $("body").on('submit', "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.massage)
                }
                initArtCateList()
                layer.msg('恭喜您更新成功');
                layer.close(indexEdit);
            }
        })
    })
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})