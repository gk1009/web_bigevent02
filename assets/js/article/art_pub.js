$(function () {
    var form = layui.form;
    var layer = layui.layer
    initEditor()
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
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $image.cropper(options)
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click()
    })

    //监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片

            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })
    var state = '已发布';
    $("#btnSavae2").on('click', function () {
        state = '草稿'
    })
    $("#form-pub").on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        // 3. 将文章存到 fd 中
        fd.append('state', state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                fd.append('cover_img', blob)
                //ajax
                publishArticle(fd)
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您,发布成功!')
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 1500)
            }
        })
    }
})