$(function () {
    getUserInfo()
    var layer = layui.layer
    $("#btnLogout").on('click', function () {
        layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1，清空本地存储中的token
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        })

    })
})


function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头配置对象,my开头的请求路径，需要添加Authorization身份认证字段
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvater(res.data)

        },
        complete: function (res) {
            console.log('执行了 complete 回调：')
            console.log(res)
            // 不论成功还是失败，最终都会调用 complete 回调函数


            // if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //     // 1. 强制清空 token
            //     localStorage.removeItem('token')
            //     // 2. 强制跳转到登录页面
            //     location.href = '/login.html'
            // }
        }
    })
}
function renderAvater(user) {
    var name = user.nickname || user.username
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name)
    //渲染用户头像
    if (user.user_pic !== null) {
        //图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avater').hide()
    } else {
        //文本头像
        $('.layui-nav-img').hide()
        var first = name[0].getUserInfo()
        $('.text-avater').html(first).show()
    }
}


