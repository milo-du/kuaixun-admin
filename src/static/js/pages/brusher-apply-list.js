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
				table: $('#table'),
				search: $("#search")
			});
		},
		initData: function() {
			$.extend(data, {
				list: [],
				filter: {
					offset: 0,
					limit: 10
				}
			});
		},
		bindEvent: function() {
			nodes.table.on('click', '[data-action]', this.handleAction);
			//nodes.search.on('submit',this.handleSearch);
		},
		handleAction: function(event) {
			event.preventDefault();
			var self = $(this);
			action = self.attr('data-action');

			switch (action) {
				case 'recive':
					page.handleRecive(self);
					break;
			}
		},
		handleRecive: function(self, type) {
			var id = self.attr('data-id');
			return System.request({
					type: 'POST',
					url: 'admin/sureApply',
					data: {
						id: id
					}
				})
				.done(function(response) {
					if (response.ret == 0) {
						$.toast({
							icon: 'success',
							text: '确认打款成功'
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
		},
		getData: function(params) {
			return System.request({
					type: 'GET',
					url: 'admin/get_brusher_apply_job_list',
					data: $.extend(data.filter, {
						begin: params.data.offset,
						limit: params.data.limit
					})
				})
				.done(function(response) {
					if (response.ret == 0) {
						var list = {
							rows: response.data.data,
							total: response.data.total
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
		operateFormatter: function(value, row, index) {
			var tpl = ['<div class="btn-group btn-group-xs opr-btn">'];
			tpl.push('<button data-action="recive" data-id="' + row.userID + '" class="btn btn-sm btn-success" type="button">确认打款</button>');
			tpl.push('</div>');

			return tpl.join('');
		},
		statusFormatter: function(value, row, index) {
			if (row.done == "0") {
				return '刷手进行中';
			} else {
				return '已完成';
			}
		},
		applyStatusFormatter: function(value, row, index) {
			if (row.done == "0") {
				return '未申请提现';
			} else {
				return '已申请提现';
			}
		},
		timeFormatter: function(value, row, index) {
			return new Date(row.create_time * 1000).format('Y年M月d日 H:m:s');
		},
	};

	page.init();
	window.getData = page.getData;
	window.operateFormatter = page.operateFormatter;
	window.statusFormatter = page.statusFormatter;
	window.applyStatusFormatter = page.applyStatusFormatter;
});