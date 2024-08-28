import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Heading } from '../index'
import { UserType } from '../../types/typesBackend';
import { toast } from 'react-toastify';
import DeleteModal from '../common/DeleteModal';

const AddUser = () => {
	const navigate = useNavigate();
	const tableHeading = ["User", "Name", "Mail", "Actions"]
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [usersList, setUsersList] = useState<UserType[]>([]);

	const navToNewUser = () => {
		navigate('/createuser');
	}
	const navToEditUser = (user: UserType) => {
		navigate('/edituser', { state: user });
	};
	const navToAccessUser = (user: UserType) => {
		navigate('/user-permissions', { state: user });
	};

	const handleOpenModal = (user: UserType) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const cancelDelete = () => {
		setIsModalOpen(false);
		setSelectedUser(null);
	};

	const deleteUser = async () => {
		if (selectedUser) {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/user-delete/${selectedUser.iduser}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.ok) {
				toast.success('User Deleted!');
				const newUsersList = usersList.filter((item) => item.iduser !== selectedUser.iduser);
				setUsersList(newUsersList);
			} else {
				toast.error('Something went wrong!');
			}
			setIsModalOpen(false);
			setSelectedUser(null);
		}
	};

	useEffect(() => {
		const fetchItems = async () => {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/user-list`);
			const data = await response.json();

			console.log(data);
			setUsersList(data);
		}
		fetchItems();
	}, []);

	return (
		<div className="font-manrope flex-1 w-full">
			<Heading title="User Configuration" showBackBtn={false} />
			<div className="flex justify-center 930:justify-start 930:pl-[29px] mt-[27px] mb-[17px] md:mb-[40px] 930:mt-[29px] 930:mb-[21px]">
				<button className="bg-lightblue hover:opacity-70 py-[10px] max-w-[222px] w-full font-medium text-dark-color" onClick={navToNewUser}>
					+ Add new user
				</button>
			</div>
			<div className="overflow-x-auto px-[20px] 930:px-[29px]">
				<table className="w-full max-w-[700px] mx-auto 930:mx-0">
					<thead>
						<tr className="text-[.85rem]">
							{tableHeading.map((heading, index) => (
								<th key={index} className="border border-second-lightblue text-grayish-gray py-[10px] px-[20px]">
									{heading}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-lightblue ">
						{usersList.map((item) => (
							<tr className="text-[.85rem]" key={item.iduser}>
								<td className="p-[10px] text-center">{item.username}</td>
								<td className="p-[10px] text-center">{item.name_user}</td>
								<td className="p-[10px] text-center">{item.mail_user}</td>
								<td className="flex items-center justify-center py-[10px] gap-2">
									<button onClick={() => { navToAccessUser(item) }}
										className='hover:opacity-70'>
										<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 17" fill="none">
											<rect x="0.5" width="17" height="17" rx="5" fill="#367AFF" />
											<path d="M4.72222 14H3.5V13.4211C3.50269 11.1839 5.41634 9.37097 7.77778 9.36842H10.2222C12.5837 9.37097 14.4973 11.1839 14.5 13.4211V14H13.2778V13.4211C13.2758 11.8231 11.9089 10.5282 10.2222 10.5263H7.77778C6.09108 10.5282 4.72424 11.8231 4.72222 13.4211V14ZM9 8.78947C7.31246 8.78947 5.94444 7.49346 5.94444 5.89474C5.94444 4.29602 7.31246 3 9 3C10.6875 3 12.0556 4.29602 12.0556 5.89474C12.0535 7.49266 10.6867 8.78756 9 8.78947ZM9 4.15789C7.98748 4.15789 7.16667 4.93551 7.16667 5.89474C7.16667 6.85397 7.98748 7.63158 9 7.63158C10.0125 7.63158 10.8333 6.85397 10.8333 5.89474C10.8333 4.93551 10.0125 4.15789 9 4.15789Z" fill="#FCFEFF" />
										</svg>
									</button>
									<button onClick={() => { navToEditUser(item) }}
										className='hover:opacity-70'>
										<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 17" fill="none">
											<rect x="0.5" width="17" height="17" rx="5" fill="#406D42" />
											<path d="M4.10599 14C3.93667 13.9997 3.77527 13.9283 3.66115 13.8032C3.54492 13.6791 3.48717 13.5113 3.5024 13.3419L3.65028 11.7154L10.4817 4.88449L12.6166 7.01938L5.78699 13.8497L4.16092 13.9976C4.14221 13.9994 4.1235 14 4.10599 14ZM13.0428 6.59252L10.9085 4.45764L12.1887 3.17707C12.3019 3.0637 12.4555 3 12.6157 3C12.7759 3 12.9295 3.0637 13.0428 3.17707L14.323 4.45764C14.4363 4.57088 14.5 4.72455 14.5 4.8848C14.5 5.04504 14.4363 5.19871 14.323 5.31195L13.0434 6.59192L13.0428 6.59252Z" fill="white" />
										</svg>
									</button>
									<button onClick={() => handleOpenModal(item)}
										className='hover:opacity-70'>
										<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 17" fill="none">
											<rect x="0.5" width="17" height="17" rx="5" fill="#FF6F6F" />
											<path d="M12.0556 14H5.94444C5.26943 14 4.72222 13.5075 4.72222 12.9V5.75H3.5V4.65H5.94444V4.1C5.94444 3.49249 6.49165 3 7.16667 3H10.8333C11.5083 3 12.0556 3.49249 12.0556 4.1V4.65H14.5V5.75H13.2778V12.9C13.2778 13.5075 12.7306 14 12.0556 14ZM5.94444 5.75V12.9H12.0556V5.75H5.94444ZM7.16667 4.1V4.65H10.8333V4.1H7.16667ZM10.8333 11.8H9.61111V6.85H10.8333V11.8ZM8.38889 11.8H7.16667V6.85H8.38889V11.8Z" fill="white" />
										</svg>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{isModalOpen && (
				<DeleteModal
					setIsModalOpen={setIsModalOpen}
					itemName={selectedUser!.username}
					cancelDelete={cancelDelete}
					deleteUser={deleteUser}
				/>
			)}

		</div>
	)
}
export default AddUser