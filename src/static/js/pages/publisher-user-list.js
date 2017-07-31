$(function() {

	var nodes = {};

	var data = {};

	var page = {
		init: function() {
			this.initNodes();
			this.initData();
			this.bindEvent();
		},
		initNodes: function() {
			$.extend(nodes, {
				wrapper: $('#wrapper'),
				filters: $('#filters'),
				keyword: $('#keyword'),
				search: $('#search'),
				table: $('#table'),
				submit: $('#submit'),
				failmsg: $('#failmsg'),
				money: $("#money"),
				detailBody: $('#detailBody'),
				rechargeForm: $("#rechargeForm"),
				rechargeModal: $("#rechargeModal")
			});
		},
		initData: function() {
			$.extend(data, {
				list: [],
				filter: {
					status: 1
				}
			});
		},
		bindEvent: function() {
			nodes.table.on('click', '[data-action]', this.handleAction);
			nodes.submit.on('click', this.handleSubmitRecharge);
		},
		handleAction: function(event) {
			event.preventDefault();
			var self = $(this),
				action = self.attr('data-action'),
				uid = self.attr('data-userid');            
			switch (action) {
				case 'recharge':
					data.rechargeUserID = uid;
					break;
			}
		},
		handleDelete: function(self, type) {
			var id = self.attr('data-id');
			return System.request({
					type: 'POST',
					url: 'manage/delete_user',
					data: {
						id: id
					}
				})
				.done(function(response) {
					if (response.res == 0) {
						$.toast({
							icon: 'success',
							text: '删除成功'
						});

						nodes.table.bootstrapTable('refresh');
					} else {
						$.toast({
							icon: 'error',
							text: response.msg
						});
					}
				});
		},
		handleSearch: function(event) {
			event.preventDefault();
			data.filter.keyWord = $.trim(nodes.keyword.val());
			page.refresh();
		},
		refresh: function() {
			nodes.table.bootstrapTable('selectPage', 1);
			/*nodes.table.bootstrapTable('refreshOptions', {
				queryParams: function(params) {
					params.offset = 0;

					return params;
				}
			});*/
		},
		handleSubmitRecharge: function() {
			var submitFormData = nodes.rechargeForm.serializeObject();
			if ($.trim(submitFormData.money).length == 0) {
				$.toast({
					icon: 'error',
					text: '请输入充值金额'
				});
				return;
			}
			submitFormData.uid = data.rechargeUserID;
			return System.request({
					type: 'POST',
					url: 'admin/recharge_publisher',
					data: submitFormData
				})
				.done(function(response) {
					if (response.ret == 0) {
						$.toast({
							icon: 'success',
							text: '充值成功'
						});
						nodes.money.val('');
						nodes.rechargeModal.modal('hide');
						page.refresh();
						data.rechargeUserID = 0;
					} else {
						$.toast({
							icon: 'error',
							text: response.msg
						});
					}
				});
		},
		getData: function(params) {
			return System.request({
					type: 'GET',
					url: 'admin/get_publisher_user_list',
					data: $.extend(data.filter, {
						begin: params.data.offset,
						limit: params.data.limit
					})
				})
				.done(function(response) {
					if (response.ret == 0) {
						var list = {
							rows: response.data,
							total: response.total
						};

						params.success(list);
						data.filter.keyWord = null;
						data.list = response.data;
					} else {
						$.toast({
							icon: 'error',
							text: response.msg
						});
					}
				})
		},
		managerFormatter: function(value, row, index) {
			return [
				'否',
				'是'
			][row.is_admin];
		},
		statusFormatter: function(value, row, index) {
			return [
				'<span class="label label-success">可用</span>',
				'<span class="label label-danger">禁用</span>'
			][row.status];
		},
		operateFormatter: function(value, row, index) {
			var tpl = ['<div class="btn-group btn-group-xs opr-btn">'];
			tpl.push('<a data-action="recharge" data-userid="' + row.userID + '" class="btn btn-sm btn-info" data-toggle="modal" data-target="#rechargeModal">充值</a>');

			return tpl.join('');
		},
		timeFormatter: function(value, row, index) {
			return new Date(row.reg_time * 1000).format('Y年M月d日 H:m:s');
		},
		photoFormatter: function(value, row, index) {
			return [
				'<img src="' + row.photo + '" data-action="zoom" width="35" onerror=\'this.error=null;this.src="/static/images/perform-default-cover.png"\' />'
			].join('');
		}
	};

	page.init();
	window.getData = page.getData;
	window.managerFormatter = page.managerFormatter;
	window.timeFormatter = page.timeFormatter;
	window.operateFormatter = page.operateFormatter;
	window.photoFormatter = page.photoFormatter;
});