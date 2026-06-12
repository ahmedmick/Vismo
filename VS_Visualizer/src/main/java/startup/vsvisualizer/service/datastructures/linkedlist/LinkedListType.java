package startup.vsvisualizer.service.datastructures.linkedlist;

/**
 * Linked list variant used for visualization routing.
 */
public enum LinkedListType {
    NORMAL("normal"),
    CIRCULAR("circular"),
    DOUBLY("doubly"),
    DOUBLY_CIRCULAR("doubly-circular");

    private final String wireValue;

    LinkedListType(String wireValue) {
        this.wireValue = wireValue;
    }

    public String getWireValue() {
        return wireValue;
    }

    public static LinkedListType fromListType(String listType) {
        if (listType == null || listType.isBlank() || NORMAL.wireValue.equals(listType)) {
            return NORMAL;
        }
        for (LinkedListType type : values()) {
            if (type.wireValue.equals(listType)) {
                return type;
            }
        }
        return NORMAL;
    }
}
