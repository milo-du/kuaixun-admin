$(function() {

	var nodes = {
		form: $('#form')
	};

	var data = {
		id: System.getParam('id') || 0,
		formData: {
			cover: ''
		},
	};

	var page = {
		init: function() {
			nodes.form.html(System.template('appTpl', {
				info: {
					is_delete: 0
				}
			}));
			this.bindEvents();
		},
		initNodes: function() {
			$.extend(nodes, {
				wrapper: $('#wrapper'),
				submit: $('#submit'),
			});
		},
		bindEvents: function() {
			this.initNodes();
			nodes.form.on('submit', this.handleSubmit);
		},
		handleSubmit: function(event) {
			event.preventDefault();
			var formData = nodes.form.serializeObject();
			if (!formData.count) {
				$.toast({
					icon: 'error',
					text: '请输入总数'
				});
				return;
			}
			if (!formData.money) {
				$.toast({
					icon: 'error',
					text: '请输入金额'
				});
				return;
			}
			formData.brusherUserID = 10023;
			nodes.submit.prop('disabled', true);
			return System.request({
					type: 'POST',
					url: 'admin/set_readonly',
					data: formData
				})
				.done(function(response) {
					if (response.ret == 0) {
						$.toast({
							icon: 'success',
							text: '发布成功'
						});
					} else {
						$.toast({
							icon: 'error',
							text: response.msg
						});
					}
				})
				.fail(function() {
					$.toast({
						icon: 'error',
						text: '网络错误'
					});
				})
				.always(function() {
					nodes.submit.prop('disabled', false);
				});
		},
		getData: function(id) {
			return System.request({
					type: 'get',
					url: 'manage/get_article_tag_detail',
					data: {
						id: id
					}
				})
				.done(function(response) {
					if (response.res != 0) {
						$.toast({
							icon: 'error',
							text: response.msg
						});
					}
				})
				.fail(function() {
					$.toast({
						icon: 'error',
						text: '网络错误'
					});
				});

		}
	}
	page.init();

});