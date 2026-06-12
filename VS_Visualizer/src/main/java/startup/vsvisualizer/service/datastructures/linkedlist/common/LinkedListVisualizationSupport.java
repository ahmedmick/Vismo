package startup.vsvisualizer.service.datastructures.linkedlist.common;

import java.util.ArrayList;
import java.util.List;

public final class LinkedListVisualizationSupport {

    private LinkedListVisualizationSupport() {
    }

    public static String formatValue(Double value) {
        if (value == value.longValue()) {
            return String.valueOf(value.longValue());
        }
        return String.valueOf(value);
    }

    public static List<Double> copyArray(List<Double> source) {
        return new ArrayList<>(source);
    }
}
