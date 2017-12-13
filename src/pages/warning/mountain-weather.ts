import { Component, Input } from "@angular/core";
import { Warning, WarningType } from "../../store/models/Warning";
import { TranslateService } from "@ngx-translate/core";

enum Type {
  RainFall = 10,
  Wind = 20,
  WindDirection = 30,
  Temperature = 40,
  ZeroIsoterm = 50
}

enum SubType {
  RainFallFrom = 70,
  RainFallTo = 60
}

interface MeasurementType {
  Id: number;
  Name: string;
  SortOrder: number;
  MeasurementSubTypes: {
    Id: number;
    Name: string;
    SortOrder: number;
    Value: string;
  }[];
}

interface Weather {
  MeasurementTypes: MeasurementType[];
}

@Component({
  selector: "mountain-weather",
  templateUrl: "mountain-weather.html"
})
export class MountainWeather {
  @Input() weather: Weather;
  measurmentTypeIds: number[];

  constructor(private _translateService: TranslateService) {}

  ngOnChanges() {
    console.log(this.weather.MeasurementTypes);
    this.measurmentTypeIds = this.weather.MeasurementTypes.filter(
      type => type.Id !== Type.WindDirection
    )
      .filter(
        type =>
          !!type.MeasurementSubTypes && type.MeasurementSubTypes.length > 0
      )
      .sort((a, b) => (a.SortOrder > b.SortOrder ? 1 : -1))
      .map(type => type.Id);
  }

  transformToString(id: number): string {
    const { labelKey, descriptionKey, descriptionValues } = stringFactory[id](
      this.weather.MeasurementTypes
    );

    const label = labelKey ? this._translateService.instant(labelKey) : "";
    const description = descriptionKey
      ? this._translateService.instant(descriptionKey, descriptionValues)
      : "";

    return `${label}: ${description}`;
  }
}

const stringFactory = {
  [Type.RainFall]: (
    measurementTypes: MeasurementType[]
  ): { labelKey: string; descriptionKey: string; descriptionValues: any } => {
    const type = findType(measurementTypes, Type.RainFall);
    const from = parseInt(subTypeValue(type, SubType.RainFallFrom));
    const to = parseInt(subTypeValue(type, SubType.RainFallTo));
    let key = "RAINFALL.LONG";

    if (from === 0 && to === 0) {
      key = "RAINFALL.NONE";
    } else if (to - from < 5) {
      key = "RAINFALL.SHORT";
    }

    return {
      labelKey: type.Name,
      descriptionKey: key,
      descriptionValues: { from, to }
    };
  },
  [Type.Wind]: (measurementTypes: MeasurementType[]) => {
    const type = findType(measurementTypes, Type.Wind);
    return {
      labelKey: type.Name,
      descriptionKey: null,
      descriptionValues: {}
    };
  },
  [Type.Temperature]: (measurementTypes: MeasurementType[]) => {
    const type = findType(measurementTypes, Type.Temperature);
    return {
      labelKey: type.Name,
      descriptionKey: null,
      descriptionValues: {}
    };
  },
  [Type.ZeroIsoterm]: (measurementTypes: MeasurementType[]) => {
    const type = findType(measurementTypes, Type.ZeroIsoterm);
    return {
      labelKey: type.Name,
      descriptionKey: null,
      descriptionValues: {}
    };
  }
};

const findType = (measurementTypes: MeasurementType[], typeId: number) => {
  return measurementTypes.find(type => type.Id === typeId);
};

const subTypeValue = (type: MeasurementType, subTypeId: SubType): string => {
  const subType = type.MeasurementSubTypes.find(
    subType => subType.Id == subTypeId
  );

  if (subType) {
    return subType.Value;
  }
};
