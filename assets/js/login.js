$(function () {
    $('#lik_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //自定义校验
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '请输入6-12位字符'],
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })
    var layer = layui.layer
    //监听注册表单的提交申请
    $("#form_reg").on('submit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        //发起AJAX的POST请求
        $.ajax({
            method: "POST",
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜注册成功')
                $('#link_login').click()
                $('#form_reg').click()
            }
        })
    })
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜你登录成功')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})