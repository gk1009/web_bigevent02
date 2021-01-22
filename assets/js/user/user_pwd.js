$(function () {
    //检测规则
    var form = layui.form
    form.verify({
        //1.1密码
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能有空格'],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新密码不能与旧密码相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致！'
            }
        }

    })
    //表单提交
    $(".layui-form").on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败')
                }
                layui.layer.msg('修改密码成功')
                $('.layui-form')[0].reset();
            }

        })
    })
})