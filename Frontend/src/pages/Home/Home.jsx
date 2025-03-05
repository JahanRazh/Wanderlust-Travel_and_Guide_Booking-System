import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import { ToastContainer, toast } from 'react-toastify';
import EmptyCard from '../../components/Cards/EmptyCard';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import EmptyImg from '../../assets/images/add-story.png';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import { getEmptyCardMessage } from '../../utils/helper';

const Home = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [allStories, setAllStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [dateRange, setDateRange] = useState({ from: null, to: null });

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [openViewModal, setOpenViewModal] = useState({
        isShown: false,
        data: null,
    });

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data?.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
            console.error("Error fetching user info:", error);
        }
    };

    const getAllTravelStories = async () => {
        try {
            const response = await axiosInstance.get("/get-all-travel-stories");
            if (response.data?.travelStories) {
                setAllStories(response.data.travelStories);
                setFilteredStories(response.data.travelStories);
            }
        } catch (error) {
            console.error("An error occurred while fetching stories:", error);
            toast.error("Failed to fetch stories");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (data) => {
        setOpenAddEditModal({ isShown: true, type: "edit", data });
    };

    const handleViewStory = (data) => {
        setOpenViewModal({ isShown: true, data });
    };

    const updateFavorite = async (storyData) => {
        try {
            const response = await axiosInstance.put(`/update-favourite/${storyData._id}`, {
                isFavourite: !storyData.isFavourite,
            });
            if (response.data) {
                const updatedStories = allStories.map((story) =>
                    story._id === storyData._id ? { ...story, isFavourite: !story.isFavourite } : story
                );
                setAllStories(updatedStories);
                setFilteredStories(updatedStories);
                toast.success("Story updated successfully.");
            }
        } catch (error) {
            console.error("Error updating favorite status:", error);
            toast.error("Failed to update favorite status");
        }
    };

    const deleteTravelStory = async (data) => {
        if (!data?._id) return;
        
        const originalStories = [...allStories];
        try {
            const updatedStories = allStories.filter(story => story._id !== data._id);
            setAllStories(updatedStories);
            setFilteredStories(updatedStories);

            const response = await axiosInstance.delete(`/delete-travel-story/${data._id}`);
            
            if (response.status === 200 || response.status === 204) {
                toast.success("Story deleted successfully.");
                setOpenViewModal({ isShown: false, data: null });
            } else {
                setAllStories(originalStories);
                setFilteredStories(originalStories);
                toast.error("Failed to delete the story.");
            }
        } catch (error) {
            setAllStories(originalStories);
            setFilteredStories(originalStories);
            toast.error(error.response?.data?.message || "Failed to delete the story");
        }
    };

    const searchStories = (query) => {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) {
            setFilteredStories(allStories);
            setFilterType("");
            return;
        }

        const matchedStories = allStories.filter(story => {
            const titleMatch = story.title.toLowerCase().includes(searchTerm);
            const storyMatch = story.story.toLowerCase().includes(searchTerm);
            const locationMatch = story.visitedLocations.some(location => 
                location.toLowerCase().includes(searchTerm)
            );
            
            return titleMatch || storyMatch || locationMatch;
        });

        setFilteredStories(matchedStories);
        setFilterType("search");
        setSearchQuery(query);
    };

    const handleClearSearch = () => {
        setFilterType("");
        setSearchQuery("");
        setFilteredStories(allStories);
    };

    const filterStoriesByDate = async (dateRange) => {
        if (!dateRange?.from || !dateRange?.to) return;

        try {
            const startDate = new Date(dateRange.from).getTime();
            const endDate = new Date(dateRange.to).getTime();

            const filteredStories = allStories.filter(story => {
                const storyDate = new Date(story.visitedDate).getTime();
                return storyDate >= startDate && storyDate <= endDate;
            });

            setFilteredStories(filteredStories);
            setFilterType("date");
        } catch (error) {
            console.error("An error occurred while filtering stories by date:", error);
            toast.error("Failed to filter stories by date");
        }
    };

    const handleDayClick = (range) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            filterStoriesByDate(range);
        }
    };

    const resetFilter = () => {
        setDateRange({ from: null, to: null });
        setFilterType("");
        setFilteredStories(allStories);
    };

    const handleCloseAddEditModal = () => {
        setOpenAddEditModal({ isShown: false, type: "add", data: null });
        getAllTravelStories();
    };

    useEffect(() => {
        getUserInfo();
        getAllTravelStories();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <>
            <Navbar
                userInfo={userInfo}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchNote={searchStories}
                handleClearSearch={handleClearSearch}
            />

            <div className="container mx-auto px-10">
                <FilterInfoTitle
                    filterType={filterType}
                    filterDates={dateRange}
                    onClear={resetFilter}
                />

                <div className="flex gap-7">
                    <div className="flex-1">
                        {filteredStories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredStories.map((item) => (
                                    <TravelStoryCard
                                        key={item._id}
                                        ImgUrl={item.ImageUrl}
                                        title={item.title}
                                        story={item.story}
                                        date={item.visitedDate}
                                        visitedLocations={item.visitedLocations}
                                        isFavorite={item.isFavourite}
                                        onEdit={() => handleEdit(item)}
                                        onClick={() => handleViewStory(item)}
                                        onFavoriteClick={() => updateFavorite(item)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyCard
                                imgSrc={EmptyImg}
                                message={getEmptyCardMessage(filterType)}
                            />
                        )}
                    </div>
                  
                    <div className="w-[320px] hidden md:block">
                        <div className="bg-white border border-slate-200 shadow-slate-200/60 rounded-lg">
                            <div className="p-3">
                                <DayPicker
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={handleDayClick}
                                    numberOfMonths={1}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={handleCloseAddEditModal}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                        zIndex: 999,
                    },
                }}
                appElement={document.getElementById("root")}
                className="model-box"
            >
                <AddEditTravelStory
                    type={openAddEditModal.type}
                    storyInfo={openAddEditModal.data}
                    onClose={handleCloseAddEditModal}
                    getAllTravelStories={getAllTravelStories}
                />
            </Modal>

            <Modal
                isOpen={openViewModal.isShown}
                onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                        zIndex: 999,
                    },
                }}
                appElement={document.getElementById("root")}
                className="model-box"
            >
                <ViewTravelStory
                    storyInfo={openViewModal.data}
                    onClose={() => setOpenViewModal({ isShown: false, data: null })}
                    onDeleteClick={() => deleteTravelStory(openViewModal.data)}
                    onEditClick={() => {
                        setOpenViewModal({ isShown: false, data: null });
                        handleEdit(openViewModal.data);
                    }}
                />
            </Modal>

            <button
                className="fixed right-10 bottom-10 w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 transition-colors"
                onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
            >
                <MdAdd className="text-3xl text-white" />
            </button>

            <ToastContainer />
        </>
    );
};

export default Home;