import { CheckboxCustomOnChange } from "../ui/Checkbox";
import { toTitleCase, convertToLabel } from "../../api/utils/utils";

export default function SpendCats({ id, spendCats, selectedCats, setSelectedCats, onChangeCat, autoScroll, viewId }) {

    return (
        <div className="max-h-[70vh] overflow-scroll">
            <CheckboxCustomOnChange key="toggleAllCats"
                    label="Select/Deselect All"
                    value={false}
                    onChange={() => {selectedCats.length !== 0 ? setSelectedCats([]) :
                        setSelectedCats(spendCats.map(cat=>toTitleCase(cat)));setTimeout(() => {
                            if (autoScroll)
                            document.getElementById(viewId)?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                    }}
                />
                <hr className="m-3"></hr>
            {spendCats.map(cat =>
                <CheckboxCustomOnChange key={convertToLabel(cat)}
                    label={toTitleCase(cat)}
                    value={selectedCats.includes(toTitleCase(cat))}
                    onChange={() => onChangeCat(toTitleCase(cat))}
                />)
            }
        </div>
    );

}