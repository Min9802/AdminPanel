
--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'Quản trị viên cấp cao', '2022-08-23 12:19:06', '2022-08-23 16:27:49'),
(2, 'Mod', 'Quản trị viên', '2022-08-23 14:51:27', '2022-08-27 15:33:46');

--
-- Chỉ mục cho các bảng đã đổ
--
--
-- Đang đổ dữ liệu cho bảng `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `display_name`, `parent_id`, `key_code`, `created_at`, `updated_at`) VALUES
(1, 'permission', 'permission', 0, NULL, '2022-08-24 20:28:32', '2022-08-24 20:28:32'),
(2, 'list', 'list', 1, 'permission_list', '2022-08-24 20:28:32', '2022-08-24 20:28:32'),
(3, 'add', 'add', 1, 'permission_add', '2022-08-24 20:28:32', '2022-08-24 20:28:32'),
(4, 'edit', 'edit', 1, 'permission_edit', '2022-08-24 20:28:32', '2022-08-24 20:28:32'),
(5, 'delete', 'delete', 1, 'permission_delete', '2022-08-24 20:28:32', '2022-08-24 20:28:32'),
(6, 'role', 'role', 0, NULL, '2022-08-25 08:39:33', '2022-08-25 08:39:33'),
(7, 'list', 'list', 6, 'role_list', '2022-08-25 08:39:33', '2022-08-25 08:39:33'),
(8, 'add', 'add', 6, 'role_add', '2022-08-25 09:01:39', '2022-08-25 09:01:39'),
(9, 'edit', 'edit', 6, 'role_edit', '2022-08-25 09:01:39', '2022-08-25 09:01:39'),
(10, 'delete', 'delete', 6, 'role_delete', '2022-08-25 09:01:39', '2022-08-25 09:01:39'),
(11, 'staff', 'staff', 0, NULL, '2022-08-25 09:05:43', '2022-08-25 09:05:43'),
(12, 'list', 'list', 11, 'staff_list', '2022-08-25 09:05:43', '2022-08-25 09:05:43'),
(13, 'add', 'add', 11, 'staff_add', '2022-08-25 09:05:43', '2022-08-25 09:05:43'),
(14, 'edit', 'edit', 11, 'staff_edit', '2022-08-25 09:05:43', '2022-08-25 09:05:43'),
(15, 'delete', 'delete', 11, 'staff_delete', '2022-08-25 09:05:43', '2022-08-25 09:05:43');

--
-- Chỉ mục cho các bảng đã đổ
--
-- Đang đổ dữ liệu cho bảng `permission_roles`
--

INSERT INTO `permission_roles` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, NULL, NULL),
(2, 1, 3, NULL, NULL),
(4, 1, 5, NULL, NULL),
(9, 1, 4, NULL, NULL),
(10, 1, 7, NULL, NULL),
(29, 1, 9, NULL, NULL),
(31, 1, 10, NULL, NULL),
(34, 1, 8, NULL, NULL),
(37, 1, 12, NULL, NULL),
(38, 1, 13, NULL, NULL),
(39, 1, 14, NULL, NULL),
(40, 1, 15, NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--
--
-- Đang đổ dữ liệu cho bảng `role_admins`
--

INSERT INTO `role_admins` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(3, 1, 1, NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--
