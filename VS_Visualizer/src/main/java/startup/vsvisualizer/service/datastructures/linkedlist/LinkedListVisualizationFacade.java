package startup.vsvisualizer.service.datastructures.linkedlist;

import org.springframework.stereotype.Service;
import startup.vsvisualizer.dto.datastructures.array.ArrayOperationRequest;
import startup.vsvisualizer.entity.visualization.VisualizationStep;
import startup.vsvisualizer.service.datastructures.linkedlist.circular.CircularLinkedListVisualizer;
import startup.vsvisualizer.service.datastructures.linkedlist.doubly.DoublyLinkedListVisualizer;
import startup.vsvisualizer.service.datastructures.linkedlist.doublycircular.DoublyCircularLinkedListVisualizer;
import startup.vsvisualizer.service.datastructures.linkedlist.normal.NormalLinkedListVisualizer;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Routes linked list visualization requests to the correct type-specific visualizer.
 */
@Service
public class LinkedListVisualizationFacade {

    private final Map<LinkedListType, LinkedListVisualizer> visualizersByType;

    public LinkedListVisualizationFacade(
            NormalLinkedListVisualizer normal,
            CircularLinkedListVisualizer circular,
            DoublyLinkedListVisualizer doubly,
            DoublyCircularLinkedListVisualizer doublyCircular
    ) {
        visualizersByType = new EnumMap<>(LinkedListType.class);
        visualizersByType.put(LinkedListType.NORMAL, normal);
        visualizersByType.put(LinkedListType.CIRCULAR, circular);
        visualizersByType.put(LinkedListType.DOUBLY, doubly);
        visualizersByType.put(LinkedListType.DOUBLY_CIRCULAR, doublyCircular);
    }

    public List<VisualizationStep> accessByIndex(List<Double> nodes, int targetIndex, String listType) {
        return resolve(listType).accessByIndex(nodes, targetIndex, listType);
    }

    public List<VisualizationStep> updateAtPosition(ArrayOperationRequest request) {
        return resolve(request).updateAtPosition(request);
    }

    public List<VisualizationStep> insertAtHead(ArrayOperationRequest request) {
        return resolve(request).insertAtHead(request);
    }

    public List<VisualizationStep> insertAtTail(ArrayOperationRequest request) {
        return resolve(request).insertAtTail(request);
    }

    public List<VisualizationStep> insertAtPosition(ArrayOperationRequest request) {
        int index = request.getIndex().intValue();
        if (index == 0) {
            return resolve(request).insertAtHead(request);
        }
        if (index == request.getArray().size()) {
            return resolve(request).insertAtTail(request);
        }
        return resolve(request).insertAtPosition(request);
    }

    public List<VisualizationStep> deleteAtHead(ArrayOperationRequest request) {
        return resolve(request).deleteAtHead(request);
    }

    public List<VisualizationStep> deleteAtTail(ArrayOperationRequest request) {
        return resolve(request).deleteAtTail(request);
    }

    public List<VisualizationStep> deleteAtPosition(ArrayOperationRequest request) {
        return resolve(request).deleteAtPosition(request);
    }

    public List<VisualizationStep> searchForValue(ArrayOperationRequest request) {
        return resolve(request).searchForValue(request);
    }

    public List<VisualizationStep> traverseTheArray(ArrayOperationRequest request) {
        return resolve(request).traverseTheArray(request);
    }

    private LinkedListVisualizer resolve(ArrayOperationRequest request) {
        return resolve(request.getListType());
    }

    private LinkedListVisualizer resolve(String listType) {
        return visualizersByType.get(LinkedListType.fromListType(listType));
    }
}
