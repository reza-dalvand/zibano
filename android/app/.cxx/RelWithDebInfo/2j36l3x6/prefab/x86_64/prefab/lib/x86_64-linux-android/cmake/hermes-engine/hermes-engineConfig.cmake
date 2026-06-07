if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/home/reza/.gradle/caches/9.0.0/transforms/2fcb3d5b403af7b954c534efe6e78c6f/transformed/hermes-android-0.14.1-release/prefab/modules/hermesvm/libs/android.x86_64/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/reza/.gradle/caches/9.0.0/transforms/2fcb3d5b403af7b954c534efe6e78c6f/transformed/hermes-android-0.14.1-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

